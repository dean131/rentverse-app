// File Path: apps/core-service/src/services/storage.service.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";
import { randomUUID } from "crypto";

// This service handles all interactions with our MinIO S3-compatible bucket.
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = config.minio.bucket;
    this.s3Client = new S3Client({
      endpoint: `http://${config.minio.endpoint}:${config.minio.port}`,
      region: "us-east-1", // This is required for AWS SDK v3, can be any valid region
      credentials: {
        accessKeyId: config.minio.accessKey,
        secretAccessKey: config.minio.secretKey,
      },
      forcePathStyle: true, // IMPORTANT: This is required for MinIO
    });
  }

  /**
   * Generates a secure, temporary pre-signed URL for uploading a file.
   * @param {string} contentType The MIME type of the file to be uploaded.
   * @returns {Promise<{ uploadUrl: string; key: string; }>} The pre-signed URL and the unique key for the file.
   */
  async getPresignedUploadUrl(contentType: string) {
    const key = randomUUID(); // Generate a unique key for the file

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    // The URL is valid for 5 minutes
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    return { uploadUrl, key };
  }
}
