import httpStatus from "http-status";
import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ShopService } from "./shop.service";

const getShopById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ShopService.getShopById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Shop retrieved successfully",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }
});

const getAllShops = catchAsync(async (req, res) => {
  const result = await ShopService.getAllShops(req.query);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      meta: result.meta,
      data: result?.result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Shops retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createShop = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await ShopService.createShop(
    userId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shop created successfully",
    data: result,
  });
});

const updateShop = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await ShopService.updateShop(
    id,
    userId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop updated successfully",
    data: result,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ShopService.deleteShop(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop deleted successfully",
    data: result,
  });
});

const getShopByOwnerId = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await ShopService.getShopByOwnerId(userId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Shop retrieved successfully by Owner ID",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }
});

const toggleShopBlacklistStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ShopService.toggleShopBlacklistStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop blacklisted successfully",
    data: result,
  });
});

export const ShopController = {
  getShopById,
  getAllShops,
  createShop,
  updateShop,
  deleteShop,
  getShopByOwnerId,
  toggleShopBlacklistStatus,
};
