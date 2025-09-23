// File Path: apps/core-service/src/config/index.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const validateEnv = (varName: string, defaultValue?: string): string => {
  const value = process.env[varName] || defaultValue;
  if (!value) {
    console.error(`FATAL ERROR: Environment variable ${varName} is not set.`);
    process.exit(1);
  }
  return value;
};

export const config = {
  env: validateEnv("NODE_ENV", "development"),
  port: parseInt(validateEnv("PORT", "8080"), 10),
  frontendUrl: validateEnv("FRONTEND_URL", "http://localhost:3000"),

  databaseUrl: validateEnv("DATABASE_URL"),

  jwt: {
    accessSecret: validateEnv("JWT_ACCESS_SECRET"),
    refreshSecret: validateEnv("JWT_REFRESH_SECRET"),
    accessExpiration: validateEnv("JWT_ACCESS_TOKEN_EXPIRES_IN"),
    refreshExpiration: validateEnv("JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS"),
  },

  docusign: {
    clientId: validateEnv("DOCUSIGN_CLIENT_ID"),
    impersonatedUserId: validateEnv("DOCUSIGN_IMPERSONATED_USER_ID"),
    accountId: validateEnv("DOCUSIGN_ACCOUNT_ID"),
    privateKey: validateEnv("DOCUSIGN_PRIVATE_KEY_BASE64"),
    webhookSecret: validateEnv("DOCUSIGN_WEBHOOK_SECRET"),
  },

  minio: {
    // Internal URL used by the backend to talk to MinIO (e.g., http://minio:9000 when running in Docker)
    url: validateEnv("MINIO_URL"),
    // Public URL used for generating presigned URLs that the browser will call (e.g., http://127.0.0.1:9000)
    publicUrl: validateEnv("MINIO_PUBLIC_URL", process.env.MINIO_URL),
    useSSL: process.env.MINIO_USE_SSL === "true",
    bucket: validateEnv("MINIO_BUCKET_NAME", "rentverse"),
    accessKey: validateEnv("MINIO_ACCESS_KEY"),
    secretKey: validateEnv("MINIO_SECRET_KEY"),
  },
};
