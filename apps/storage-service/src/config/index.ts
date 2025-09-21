import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const validateEnv = (varName: string, defaultValue?: string): string => {
  const value = process.env[varName] || defaultValue;
  if (!value) {
    console.error(`FATAL ERROR: Environment variable ${varName} is not set.`);
    process.exit(1);
  }
  return value;
};

export const config = {
  port: parseInt(validateEnv("PORT", "8081"), 10),
  minio: {
    endPoint: validateEnv("MINIO_ENDPOINT"),
    port: parseInt(validateEnv("MINIO_PORT", "9000"), 10),
    accessKey: validateEnv("MINIO_ACCESS_KEY"),
    secretKey: validateEnv("MINIO_SECRET_KEY"),
    bucketName: validateEnv("MINIO_BUCKET"),
    useSSL: validateEnv("MINIO_USE_SSL", "false") === "true",
  },
};
