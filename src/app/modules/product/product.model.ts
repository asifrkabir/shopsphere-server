import { model, Schema } from "mongoose";
import { TProduct } from "./product.interface";
import { PRODUCT_STATUS_LIST } from "./product.constant";

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    inventoryCount: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    discountedPrice: {
      type: Number,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    status: {
      type: String,
      enum: PRODUCT_STATUS_LIST,
      default: "available",
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

export const Product = model<TProduct>("Product", productSchema);
