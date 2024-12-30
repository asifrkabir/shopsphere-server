import { z } from "zod";
import { ORDER_STATUS_LIST } from "./order.constant";

const createOrderValidationSchema = z.object({
  body: z.object({
    shop: z.string().min(1, { message: "Shop ID is required" }),
    products: z
      .array(
        z.object({
          product: z.string().min(1, { message: "Product ID is required" }),
          price: z
            .number()
            .min(0, { message: "Product price must be at least $0" }),
          quantity: z
            .number()
            .min(1, { message: "Quantity must be at least 1" }),
        })
      )
      .min(1, {
        message: "At least one product must be included in the order",
      }),
    totalPrice: z
      .number()
      .min(0, { message: "Total price must be at least $0" }),
    discount: z
      .number()
      .min(0, { message: "Discount must be at least $0" })
      .optional(),
    payment: z.string().optional(),
    deliveryAddress: z
      .string()
      .min(1, { message: "Delivery address is required" }),
    status: z
      .enum([...ORDER_STATUS_LIST] as [string, ...string[]])
      .default("pending"),
    isActive: z.boolean().default(true),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
};
