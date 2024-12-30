import { model, Schema } from "mongoose";
import { TProductCategory } from "./productCategory.interface";

const productCategorySchema = new Schema<TProductCategory>(
  {
    name: {
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

export const ProductCategory = model<TProductCategory>(
  "ProductCategory",
  productCategorySchema
);
