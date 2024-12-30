import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { getExistingUserById } from "../user/user.utils";
import { TShop } from "./shop.interface";
import { Shop } from "./shop.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { shopSearchableFields } from "./shop.constant";
import { getExistingShopById } from "./shop.utils";
import mongoose from "mongoose";
import { FollowService } from "../follow/follow.service";
import { ProductService } from "../product/product.service";
import { PRODUCT_STATUS_ENUM } from "../product/product.constant";

const getShopById = async (id: string) => {
  const result = await Shop.findOne({ _id: id, isActive: true });

  return result;
};

const getAllShops = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Shop.find({ isActive: true }).populate("owner"), query)
    .search(shopSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createShop = async (
  ownerId: string,
  payload: TShop,
  images: TImageFiles
) => {
  const existingOwner = await getExistingUserById(ownerId);

  if (!existingOwner) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner not found");
  }

  payload.owner = existingOwner._id;

  const { logoUrls } = images;

  if (logoUrls && logoUrls.length > 0) {
    payload.logoUrl = logoUrls[0]?.path;
  }

  const result = await Shop.create(payload);

  return result;
};

const updateShop = async (
  shopId: string,
  userId: string,
  payload: Partial<TShop>,
  images: TImageFiles
) => {
  const existingShop = await getExistingShopById(shopId);

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!existingShop.owner.equals(existingUser._id)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this shop"
    );
  }

  const { logoUrls } = images;

  // New Logo
  if (logoUrls && logoUrls.length > 0) {
    payload.logoUrl = logoUrls[0]?.path;
  } else if (payload.logoUrl === null) {
    // Remove Logo
    payload.logoUrl = "";
  }

  const result = await Shop.findOneAndUpdate({ _id: shopId }, payload, {
    new: true,
  });

  return result;
};

const deleteShop = async (id: string) => {
  const existingShop = await getExistingShopById(id);

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedShop = await Shop.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, session }
    );

    if (!deletedShop) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete shop"
      );
    }

    const deleteFollowsResult = await FollowService.deleteAllFollows(
      undefined,
      id,
      session
    );

    if (deleteFollowsResult === null || deleteFollowsResult === undefined) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete associated follows"
      );
    }

    const deleteProductsResult = await ProductService.deleteProductsByFilter(
      undefined,
      id,
      session
    );

    if (deleteProductsResult === null || deleteProductsResult === undefined) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete associated products"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedShop;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

const getShopByOwnerId = async (ownerId: string) => {
  const existingOwner = await getExistingUserById(ownerId);

  if (!existingOwner) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner not found");
  }

  const result = await Shop.findOne({
    owner: existingOwner._id,
    isActive: true,
  });

  return result;
};

const toggleShopBlacklistStatus = async (
  id: string,
  { isBlacklisted }: { isBlacklisted: boolean }
) => {
  const existingShop = await getExistingShopById(id);

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const blackListedShop = await Shop.findByIdAndUpdate(
      id,
      { isBlacklisted: isBlacklisted },
      { new: true, session }
    );

    if (!blackListedShop) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to blacklist shop"
      );
    }

    const status = isBlacklisted
      ? PRODUCT_STATUS_ENUM.SUSPENDED
      : PRODUCT_STATUS_ENUM.AVAILABLE;

    const toggleProductStatusResult =
      await ProductService.toggleAllProductsStatusByShop(id, status, session);

    if (
      toggleProductStatusResult === null ||
      toggleProductStatusResult === undefined
    ) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update status of associated products"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return blackListedShop;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

export const ShopService = {
  getShopById,
  getAllShops,
  createShop,
  updateShop,
  deleteShop,
  getShopByOwnerId,
  toggleShopBlacklistStatus,
};
