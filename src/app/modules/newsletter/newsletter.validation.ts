import { z } from "zod";

const createNewsletterSubscriberValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1),
  }),
});

export const NewsletterValidations = {
  createNewsletterSubscriberValidationSchema,
};
