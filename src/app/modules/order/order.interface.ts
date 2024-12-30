import { Types } from "mongoose";

export type TOrderProduct = {
  product: Types.ObjectId;
  price: number;
  quantity: number;
};

export type TOrder = {
  user: Types.ObjectId;
  shop: Types.ObjectId;
  products: TOrderProduct[];
  totalPrice: number;
  discount?: number;
  payment?: Types.ObjectId;
  status: "pending" | "complete";
  deliveryAddress: string;
  isActive: boolean;
};
