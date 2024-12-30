import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    product: z.string().min(1, { message: "Product ID is required" }),
    order: z.string().min(1, { message: "Order ID is required" }),
    rating: z
      .number()
      .min(1, { message: "Rating must be at least 1" })
      .max(5, { message: "Rating must not exceed 5" }),
    comment: z.string().optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const ReviewValidations = {
  createReviewValidationSchema,
};
