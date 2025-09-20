// File Path: apps/core-service/src/config/index.ts
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the .env file at the root of the core-service
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

/**
 * A simple validation function to ensure that a critical environment variable exists.
 * If it doesn't, the application will throw an error on startup.
 * @param varName The name of the environment variable (e.g., "DATABASE_URL").
 * @param defaultValue An optional default value to use if the variable is not set.
 * @returns The value of the environment variable.
 */
const validateEnv = (varName: string, defaultValue?: string): string => {
  const value = process.env[varName] || defaultValue;
  if (!value) {
    console.error(`FATAL ERROR: Environment variable ${varName} is not set.`);
    process.exit(1); // Exit the process with an error code
  }
  return value;
};

// Export a typed configuration object for use throughout the application.
export const config = {
  // General application settings
  env: validateEnv("NODE_ENV", "development"),
  port: parseInt(validateEnv("PORT", "8080"), 10),

  // Database URL for Prisma
  databaseUrl: validateEnv("DATABASE_URL"),

  // JSON Web Token (JWT) settings for authentication
  jwt: {
    accessSecret: validateEnv("JWT_ACCESS_SECRET"),
    refreshSecret: validateEnv("JWT_REFRESH_SECRET"),
    accessExpiration: "15m", // Access tokens are short-lived
    refreshExpiration: "7d", // Refresh tokens are long-lived
  },

  // DocuSign API settings for e-signature integration
  docusign: {
    clientId: validateEnv("DOCUSIGN_CLIENT_ID"),
    impersonatedUserId: validateEnv("DOCUSIGN_IMPERSONATED_USER_ID"),
    accountId: validateEnv("DOCUSIGN_ACCOUNT_ID"),
    privateKey: validateEnv("DOCUSIGN_PRIVATE_KEY"),
  },
};
