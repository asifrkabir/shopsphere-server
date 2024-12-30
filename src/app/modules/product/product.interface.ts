import { Types } from "mongoose";

export type TProduct = {
  name: string;
  description?: string;
  price: number;
  category: Types.ObjectId;
  inventoryCount: number;
  imageUrls?: string[];
  onSale: boolean;
  discountedPrice?: number;
  shop: Types.ObjectId;
  status: "available" | "suspended";
  isActive: boolean;
};
