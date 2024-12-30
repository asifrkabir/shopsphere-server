import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getExistingUserById } from "../user/user.utils";
import { Follow } from "./follow.model";
import { TFollow } from "./follow.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import mongoose, { ClientSession } from "mongoose";
import { getExistingShopById } from "../shop/shop.utils";
import { Shop } from "../shop/shop.model";

const getAllFollows = async (query: Record<string, unknown>) => {
  const followQuery = new QueryBuilder(
    Follow.find().populate("follower shop"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await followQuery.modelQuery;
  const meta = await followQuery.countTotal();

  return {
    meta,
    result,
  };
};

const follow = async (followerId: string, shopId: string) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const shop = await getExistingShopById(shopId);

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const existingFollow = await Follow.findOne({
    follower: follower,
    shop: shop,
  });

  if (existingFollow) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already following this shop"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const payload: TFollow = {
      follower: follower._id,
      shop: shop._id,
    };

    const createdFollow = await Follow.create([payload], { session });

    if (!createdFollow || createdFollow.length === 0) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to follow");
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shop._id,
      { $inc: { followerCount: 1 } },
      { session }
    );

    if (!updatedShop) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update follower count"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return createdFollow[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

const unfollow = async (followerId: string, shopId: string) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const shop = await getExistingShopById(shopId);

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const existingFollow = await Follow.findOne({
    follower: follower,
    shop: shop,
  });

  if (!existingFollow) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not currently following this shop"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedFollow = await Follow.findByIdAndDelete(existingFollow._id, {
      session,
    });

    if (!deletedFollow) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to unfollow");
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shop._id,
      { $inc: { followerCount: -1 } },
      { session }
    );

    if (!updatedShop) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update follower count"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedFollow;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

const deleteAllFollows = async (
  userId?: string,
  shopId?: string,
  session?: ClientSession
) => {
  const filter: Record<string, string> = {};
  if (userId) filter.follower = userId;
  if (shopId) filter.shop = shopId;

  const result = await Follow.deleteMany(filter, {
    session: session,
  });

  if (!result) {
    return null;
  }

  return result.deletedCount;
};

const checkIfUserFollowsShop = async (followerId: string, shopId: string) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const shop = await getExistingShopById(shopId);

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const result = await Follow.findOne({
    follower: follower,
    shop: shop,
  });

  if (result) {
    return true;
  } else {
    return false;
  }
};

export const FollowService = {
  getAllFollows,
  follow,
  unfollow,
  deleteAllFollows,
  checkIfUserFollowsShop,
};
