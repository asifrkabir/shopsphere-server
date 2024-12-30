import { model, Schema } from "mongoose";
import { TPayment } from "./payment.interface";
import { PAYMENT_STATUS_LIST } from "./payment.constant";

const paymentSchema = new Schema<TPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUS_LIST,
      default: "successful",
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<TPayment>("Payment", paymentSchema);
