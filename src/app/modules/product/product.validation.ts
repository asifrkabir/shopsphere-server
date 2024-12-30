import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0, { message: "Price must be at least $0" }),
    category: z.string().min(1),
    inventoryCount: z.number().min(0),
    onSale: z.boolean().optional().default(false),
    discountedPrice: z
      .number()
      .min(0, { message: "Discounted Price must be at least $0" })
      .optional(),
    shop: z.string().min(1),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z
      .number()
      .min(0, { message: "Price must be at least $0" })
      .optional(),
    category: z.string().min(1).optional(),
    inventoryCount: z.number().min(0).optional(),
    onSale: z.boolean().optional(),
    discountedPrice: z
      .number()
      .min(0, { message: "Discounted Price must be at least $0" })
      .optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
