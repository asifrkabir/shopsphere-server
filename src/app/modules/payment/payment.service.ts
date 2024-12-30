import httpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import Stripe from "stripe";
import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../errors/AppError";
import { getExistingOrderById } from "../order/order.utils";
import { getExistingUserById } from "../user/user.utils";
import { TPayment } from "./payment.interface";
import { Payment } from "./payment.model";
import { OrderService } from "../order/order.service";
import { getExistingShopById } from "../shop/shop.utils";

const stripe = new Stripe(config.stripe_secret_key!, {
  apiVersion: "2024-06-20",
});

const createPaymentIntent = async (amount: number) => {
  const roundedAmount = Math.round(amount * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: roundedAmount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent;
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(
    Payment.find().populate([
      { path: "user" },
      { path: "order" },
      { path: "shop" },
    ]),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createPayment = async (userId: string, payload: TPayment) => {
  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingOrder = await getExistingOrderById(payload.order.toString());

  if (!existingOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  const existingShop = await getExistingShopById(payload.shop.toString());

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  payload.user = existingUser._id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const createdPayments = await Payment.create([payload], { session });

    if (!createdPayments || createdPayments.length === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to make payment"
      );
    }

    const updatedOrder = await OrderService.updateOrderAfterPayment(
      existingOrder._id.toString(),
      createdPayments[0]._id.toString(),
      session
    );

    if (!updatedOrder) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update associated order"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return createdPayments;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

const getTotalRevenue = async (query: Record<string, unknown>) => {
  query.status = "successful";

  if (query.shop) {
    query.shop = new Types.ObjectId(query.shop as string);
  }

  const revenueData = await Payment.aggregate([
    { $match: query },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  return totalRevenue;
};

export const PaymentService = {
  createPaymentIntent,
  getAllPayments,
  createPayment,
  getTotalRevenue,
};
