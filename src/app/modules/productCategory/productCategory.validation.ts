import { z } from "zod";

const createProductCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Product Category Name is required",
        invalid_type_error: "Product Category Name must be a valid string",
      })
      .min(1, { message: "Product Category Name is required" }),
  }),
});

const updateProductCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Product Category Name is required",
        invalid_type_error: "Product Category Name must be a valid string",
      })
      .min(1, { message: "Product Category Name is required" }),
  }),
});

export const ProductCategoryValidations = {
  createProductCategoryValidationSchema,
  updateProductCategoryValidationSchema,
};
