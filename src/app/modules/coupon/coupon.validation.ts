import { z } from "zod";

const createCouponValidationSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    shop: z.string().min(1),
    discountPercentage: z
      .number()
      .min(0, { message: "Discount percentage must be at least 0" })
      .max(100, { message: "Discount percentage cannot be greater than 100" }),
  }),
});

const updateCouponValidationSchema = z.object({
  body: z.object({
    code: z.string().min(1).optional(),
    discountPercentage: z
      .number()
      .min(0, { message: "Discount percentage must be at least 0" })
      .max(100, { message: "Discount percentage cannot be greater than 100" })
      .optional(),
  }),
});

export const CouponValidations = {
  createCouponValidationSchema,
  updateCouponValidationSchema,
};
