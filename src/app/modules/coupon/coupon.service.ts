import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { getExistingShopById } from "../shop/shop.utils";
import { TCoupon } from "./coupon.interface";
import { Coupon } from "./coupon.model";
import { getExistingCouponById } from "./coupon.utils";

const getCouponById = async (id: string) => {
  const result = await Coupon.findOne({ _id: id, isActive: true }).populate(
    "shop"
  );

  return result;
};

const getAllCoupons = async (query: Record<string, unknown>) => {
  const couponQuery = new QueryBuilder(
    Coupon.find({ isActive: true }).populate("shop"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await couponQuery.modelQuery;
  const meta = await couponQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const getCouponByCodeAndShop = async (code: string, shopId: string) => {
  const result = await Coupon.findOne({
    code: code,
    shop: shopId,
    isActive: true,
  }).populate("shop");

  return result;
};

const createCoupon = async (payload: TCoupon) => {
  const existingShop = await getExistingShopById(payload.shop.toString());

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const existingCoupon = await getCouponByCodeAndShop(
    payload.code,
    payload.shop.toString()
  );

  if (existingCoupon) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A coupon already exists with this code"
    );
  }

  const result = await Coupon.create(payload);

  return result;
};

const updateCoupon = async (id: string, payload: Partial<TCoupon>) => {
  const existingCoupon = await getExistingCouponById(id);

  if (!existingCoupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  payload.shop = existingCoupon.shop._id;

  const duplicateCoupon = await Coupon.findOne({
    _id: { $ne: id },
    code: payload.code,
    shop: payload.shop,
    isActive: true,
  });

  if (duplicateCoupon) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A coupon already exists with this code"
    );
  }

  const result = await Coupon.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteCoupon = async (id: string) => {
  const result = await Coupon.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  return result;
};

export const CouponService = {
  getCouponById,
  getAllCoupons,
  getCouponByCodeAndShop,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
