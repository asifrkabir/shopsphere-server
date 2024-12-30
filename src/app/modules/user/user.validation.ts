import { z } from "zod";
import { USER_ROLE_LIST } from "./user.constant";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a valid string",
      })
      .min(1, { message: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a valid string",
      })
      .min(1, { message: "Password is required" }),
    role: z.enum([...USER_ROLE_LIST] as [string, ...string[]], {
      message: "Please enter a valid role",
      required_error: "Role is required",
    }),
    profilePicture: z
      .string({
        invalid_type_error: "Profile picture must be a valid string",
      })
      .optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
