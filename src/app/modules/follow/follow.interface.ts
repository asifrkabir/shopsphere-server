import { Types } from "mongoose";

export type TFollow = {
  follower: Types.ObjectId;
  shop: Types.ObjectId;
};
