import { model, Schema } from "mongoose";
import { TCoupon } from "./coupon.interface";

const couponSchema = new Schema<TCoupon>(
  {
    code: {
      type: String,
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = model<TCoupon>("Coupon", couponSchema);
