import { model, Schema } from "mongoose";
import { TOrder } from "./order.interface";
import { ORDER_STATUS_LIST } from "./order.constant";

const orderProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    products: {
      type: [orderProductSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: ORDER_STATUS_LIST,
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
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

export const Order = model<TOrder>("Order", orderSchema);
