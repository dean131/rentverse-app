import * as Minio from "minio";
import { config } from "../config/index.js";

const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

export const getPresignedUploadUrl = async (
  objectName: string,
  expiry: number = 600
): Promise<string> => {
  return new Promise((resolve, reject) => {
    minioClient.presignedPutObject(
      config.minio.bucketName,
      objectName,
      expiry,
      (err, url) => {
        if (err) {
          return reject(err);
        }
        resolve(url);
      }
    );
  });
};
