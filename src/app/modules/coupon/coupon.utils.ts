import { Coupon } from "./coupon.model";

export const getExistingCouponById = async (id: string) => {
  const result = await Coupon.findOne({ _id: id, isActive: true });

  return result;
};
