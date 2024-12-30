import { Types } from "mongoose";

export type TCoupon = {
  code: string;
  shop: Types.ObjectId;
  discountPercentage: number;
  isActive: boolean;
};
