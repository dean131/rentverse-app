import { z } from "zod";

// Schema for user registration
export const registerUserSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email({ message: "A valid email address is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    role: z.enum(["PROPERTY_OWNER", "TENANT"], {
      errorMap: () => ({
        message: "Role must be either PROPERTY_OWNER or TENANT",
      }),
    }),
  }),
});

// Schema for user login
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "A valid email address is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});
