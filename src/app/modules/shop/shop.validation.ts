import { z } from "zod";

const createShopValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a valid string",
      })
      .min(1, { message: "Name is required" }),
    description: z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a valid string",
      })
      .min(1, { message: "Description is required" }),
  }),
});

const updateShopValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a valid string",
      })
      .optional(),
    description: z
      .string({
        invalid_type_error: "Description must be a valid string",
      })
      .optional(),
  }),
});

export const ShopValidations = {
  createShopValidationSchema,
  updateShopValidationSchema,
};
