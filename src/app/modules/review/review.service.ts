import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Order } from "../order/order.model";
import { getExistingProductById } from "../product/product.utils";
import { TReplyToReview, TReview } from "./review.interface";
import { Review } from "./review.model";
import { ORDER_STATUS_ENUM } from "../order/order.constant";
import { getExistingUserById } from "../user/user.utils";
import { getExistingReviewById } from "./review.utils";

const getAllReviews = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ isActive: true }).populate("user product"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createReview = async (userId: string, payload: TReview) => {
  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingOrder = await Order.findOne({
    _id: payload.order,
    user: userId,
    "products.product": payload.product,
    status: ORDER_STATUS_ENUM.COMPLETE,
    isActive: true,
  });

  if (!existingOrder) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only review products you purchased."
    );
  }

  const existingProduct = await getExistingProductById(
    payload.product.toString()
  );
  if (!existingProduct) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Product not found for the review."
    );
  }

  const existingReview = await Review.findOne({
    product: payload.product,
    user: userId,
    isActive: true,
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this product."
    );
  }

  payload.user = existingUser._id;

  const result = await Review.create(payload);

  return result;
};

const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  return result;
};

const replyToReview = async (id: string, payload: TReplyToReview) => {
  const existingReview = await getExistingReviewById(id);

  if (!existingReview) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (existingReview?.reply) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already replied to this review"
    );
  }

  const result = await Review.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const ReviewService = {
  getAllReviews,
  createReview,
  deleteReview,
  replyToReview,
};
