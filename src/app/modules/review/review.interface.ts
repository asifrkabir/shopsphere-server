import { Types } from "mongoose";

export type TReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  comment?: string;
  reply?: string;
  isActive: boolean;
};

export type TReplyToReview = {
  reply: string;
};
