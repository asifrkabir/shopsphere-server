import { model, Schema } from "mongoose";
import { TNewsletterSubscriber } from "./newsletter.interface";

const newsletterSubscriberSchema = new Schema<TNewsletterSubscriber>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

export const NewsletterSubscriber = model<TNewsletterSubscriber>(
  "NewsletterSubscriber",
  newsletterSubscriberSchema
);
