import { z } from "zod";
import dotenv from "dotenv";

// Load .env file variables into process.env
dotenv.config();

/**
 * Defines the schema for environment variables using Zod.
 * This ensures that all required variables are present and correctly typed.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_HOST: z.string().default("127.0.0.1"),
  APP_PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1, { message: "JWT_SECRET must not be empty" }),
});

/**
 * Validates process.env against the defined schema.
 * If validation fails, it throws a detailed error, preventing the app from starting with invalid configuration.
 */
const config = envSchema.parse(process.env);

export { config };
