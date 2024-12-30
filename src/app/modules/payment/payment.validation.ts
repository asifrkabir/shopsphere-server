import { z } from "zod";
import { PAYMENT_STATUS_LIST } from "./payment.constant";

const createPostValidationSchema = z.object({
  body: z.object({
    order: z
      .string({
        required_error: "Order is required",
        invalid_type_error: "Order ID must be a valid string",
      })
      .min(1, { message: "Order is required" }),
    shop: z
      .string({
        required_error: "Shop is required",
        invalid_type_error: "Shop ID must be a valid string",
      })
      .min(1, { message: "Shop is required" }),
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a valid number",
      })
      .min(0, { message: "Amount must be at least $0" }),
    status: z
      .enum([...PAYMENT_STATUS_LIST] as [string, ...string[]], {
        message: "Please enter a valid status",
      })
      .optional(),
  }),
});

export const PaymentValidations = {
  createPostValidationSchema,
};
