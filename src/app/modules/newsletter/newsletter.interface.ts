import { Types } from "mongoose";

export type TNewsletterSubscriber = {
  email: string;
  user?: Types.ObjectId;
  isActive: boolean;
};
