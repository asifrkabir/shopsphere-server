import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { createToken } from "../auth/auth.utils";
import { userSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { encryptPassword, getExistingUserById } from "./user.utils";
import { FollowService } from "../follow/follow.service";

const getUserById = async (id: string) => {
  const result = await User.findOne({ _id: id, isActive: true }).select(
    "-password"
  );

  return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isActive: true }).select("-password"),
    query
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createUser = async (payload: TUser, images: TImageFiles) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email. Please use a different email address"
    );
  }

  const { itemImages } = images;

  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  }

  payload.password = await encryptPassword(payload.password);
  // payload.role = USER_ROLE_ENUM.user;

  const result = await User.create(payload);

  const jwtPayload = {
    userId: result._id.toString(),
    name: result.name,
    email: result.email,
    profilePicture: result?.profilePicture,
    role: result.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  (result as Partial<TUser>).password = undefined;

  return { accessToken, refreshToken, user: result };
};

const updateUser = async (
  id: string,
  payload: Partial<TUser>,
  images: TImageFiles
) => {
  const existingUser = await getExistingUserById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const { itemImages } = images;

  // New Profile Picture
  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  } else if (payload.profilePicture === null) {
    // Remove Profile Picture
    payload.profilePicture = "";
  }

  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  (result as Partial<TUser>).password = undefined;

  return result;
};

const deleteUser = async (id: string) => {
  const existingUser = await getExistingUserById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete user"
      );
    }

    const deleteFollowsResult = await FollowService.deleteAllFollows(
      id,
      undefined,
      session
    );

    if (deleteFollowsResult === null || deleteFollowsResult === undefined) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete associated follows"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedUser;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

const toggleUserSuspend = async (id: string, payload: Partial<TUser>) => {
  const existingUser = await getExistingUserById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  (result as Partial<TUser>).password = undefined;

  return result;
};

const getTotalUsers = async (query: Record<string, unknown>) => {
  query.isActive = true;

  const userData = await User.aggregate([
    { $match: query },
    { $count: "totalUsers" },
  ]);

  const totalUsers = userData.length > 0 ? userData[0].totalUsers : 0;

  return totalUsers;
};

export const UserService = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserSuspend,
  getTotalUsers,
};
