import mongoose, { ClientSession, Types } from "mongoose";
import { TOrder } from "./order.interface";
import { getExistingUserById } from "../user/user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { getExistingShopById } from "../shop/shop.utils";
import { getExistingProductById } from "../product/product.utils";
import { Product } from "../product/product.model";
import { Order } from "./order.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { ORDER_STATUS_ENUM, orderSearchableFields } from "./order.constant";

const getOrderById = async (id: string) => {
  const result = await Order.findOne({
    _id: id,
    status: "complete",
    isActive: true,
  }).populate([
    {
      path: "products",
      populate: { path: "product" },
    },
  ]);

  return result;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find({ isActive: true, status: "complete" }).populate(
      "user shop products.product"
    ),
    query
  )
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createOrder = async (userId: string, payload: TOrder) => {
  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingShop = await getExistingShopById(payload.shop.toString());

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  payload.user = existingUser._id;
  payload.shop = existingShop._id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let calculatedTotalPrice = 0;

    for (const item of payload.products) {
      const existingProduct = await getExistingProductById(
        item.product.toString()
      );

      if (!existingProduct) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product with ID: ${item.product} not found`
        );
      }

      if (existingProduct.inventoryCount < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Not enough inventory for product ${item.product}. Available: ${existingProduct.inventoryCount}, Requested: ${item.quantity}`
        );
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        existingProduct._id,
        {
          $inc: { inventoryCount: -item.quantity },
        },
        { session }
      );

      if (!updatedProduct) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Failed to update inventory of product with ID: ${item.product}`
        );
      }

      calculatedTotalPrice += item.price * item.quantity;
    }

    payload.totalPrice = calculatedTotalPrice;

    if (payload.discount) {
      payload.discount = Math.max(0, payload.discount);
    }

    const createdOrders = await Order.create([payload], { session });

    if (!createdOrders || createdOrders.length === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create order"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return createdOrders[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

const updateOrderAfterPayment = async (
  orderId: string,
  paymentId: string,
  session?: ClientSession
) => {
  const result = await Order.findByIdAndUpdate(
    orderId,
    { payment: paymentId, status: ORDER_STATUS_ENUM.COMPLETE },
    { session }
  );

  if (!result) {
    return null;
  }

  return result;
};

const getTotalOrders = async (query: Record<string, unknown>) => {
  query.isActive = true;
  query.status = "complete";

  if (query.shop) {
    query.shop = new Types.ObjectId(query.shop as string);
  }

  const orderData = await Order.aggregate([
    { $match: query },
    { $count: "totalOrders" },
  ]);

  const totalOrders = orderData.length > 0 ? orderData[0].totalOrders : 0;

  return totalOrders;
};

const getWeeklySales = async (query: Record<string, unknown>) => {
  query.isActive = true;
  query.status = "complete";

  if (query.shop) {
    query.shop = new Types.ObjectId(query.shop as string);
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfNextMonth =
    currentMonth === 11
      ? new Date(currentYear + 1, 0, 1)
      : new Date(currentYear, currentMonth + 1, 1);

  const orderData = await Order.aggregate([
    {
      $match: {
        ...query,
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      },
    },
    {
      $group: {
        _id: {
          week: { $week: "$createdAt" },
        },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.week": 1 },
    },
    {
      $project: {
        week: "$_id.week",
        totalOrders: 1,
        _id: 0,
      },
    },
  ]);

  const weeksInMonth = Array.from({ length: 5 }, (_, index) => ({
    week: `Week ${index + 1}`,
    totalOrders: 0,
  }));

  for (const data of orderData) {
    const firstWeek = orderData[0]?.week || 0;
    const weekIndex = data.week - firstWeek;
    if (weekIndex >= 0 && weekIndex < weeksInMonth.length) {
      weeksInMonth[weekIndex].totalOrders = data.totalOrders;
    }
  }

  return weeksInMonth;
};

export const OrderService = {
  getOrderById,
  getAllOrders,
  createOrder,
  updateOrderAfterPayment,
  getTotalOrders,
  getWeeklySales,
};
