import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { getExistingUserByEmail } from "../user/user.utils";
import { TNewsletterSubscriber } from "./newsletter.interface";
import { NewsletterSubscriber } from "./newsletter.model";
import { getExistingNewsletterSubscriptionByEmail } from "./newsletter.utils";

const getNewsletterSubscriptionById = async (id: string) => {
  const result = await NewsletterSubscriber.findOne({
    _id: id,
    isActive: true,
  }).populate("user");

  return result;
};

const getAllNewsletterSubscriptions = async (
  query: Record<string, unknown>
) => {
  const newsletterSubscriptionQuery = new QueryBuilder(
    NewsletterSubscriber.find({ isActive: true }).populate("user"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await newsletterSubscriptionQuery.modelQuery;
  const meta = await newsletterSubscriptionQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createNewsletterSubscription = async (payload: TNewsletterSubscriber) => {
  const existingNewsletterSubscription =
    await getExistingNewsletterSubscriptionByEmail(payload.email);

  if (existingNewsletterSubscription) {
    throw new AppError(httpStatus.CONFLICT, "This email is already subscribed");
  }

  const existingUser = await getExistingUserByEmail(payload.email);

  if (existingUser) {
    payload.user = existingUser._id;
  }

  const result = await NewsletterSubscriber.create(payload);

  return result;
};

const deleteNewsletterSubscription = async (id?: string, email?: string) => {
  if (!id && !email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Either 'id' or 'email' must be provided."
    );
  }

  const filter = id ? { _id: id } : { email };

  const result = await NewsletterSubscriber.findOneAndUpdate(
    filter,
    { isActive: false },
    { new: true }
  );

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Newsletter subscription not found."
    );
  }

  return result;
};

export const NewsletterService = {
  getNewsletterSubscriptionById,
  getAllNewsletterSubscriptions,
  createNewsletterSubscription,
  deleteNewsletterSubscription,
};
