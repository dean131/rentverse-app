// File Path: apps/core-service/src/services/storage.service.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";
import { randomUUID } from "crypto";

export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = config.minio.bucket;
    this.s3Client = new S3Client({
      endpoint: config.minio.url,
      region: "us-east-1",
      credentials: {
        accessKeyId: config.minio.accessKey,
        secretAccessKey: config.minio.secretKey,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async getPresignedUploadUrl(contentType: string) {
    const key = randomUUID();
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });
    return { uploadUrl, key };
  }
}
