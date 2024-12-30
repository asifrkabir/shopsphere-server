import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CouponService } from "./coupon.service";

const getCouponById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CouponService.getCouponById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coupon retrieved successfully",
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

const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponService.getAllCoupons(req.query);

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
      message: "Coupons retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const getCouponByCodeAndShop = catchAsync(async (req, res) => {
  const { code, shopId } = req.query;

  const result = await CouponService.getCouponByCodeAndShop(
    code as string,
    shopId as string
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coupon retrieved successfully",
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

const createCoupon = catchAsync(async (req, res) => {
  const result = await CouponService.createCoupon(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Coupon created successfully",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CouponService.updateCoupon(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CouponService.deleteCoupon(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon deleted successfully",
    data: result,
  });
});

export const CouponController = {
  getCouponById,
  getAllCoupons,
  getCouponByCodeAndShop,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
