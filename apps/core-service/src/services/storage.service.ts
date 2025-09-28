// File Path: apps/core-service/src/services/storage.service.ts
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  type CORSConfiguration,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";
import { randomUUID } from "crypto";

export class StorageService {
  private s3Client: S3Client;
  private signerClient: S3Client;
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

    // Use a separate client for presigning that points to the browser-accessible URL
    // so that the generated presigned URL host is reachable from the client.
    this.signerClient = new S3Client({
      endpoint: config.minio.publicUrl,
      region: "us-east-1",
      credentials: {
        accessKeyId: config.minio.accessKey,
        secretAccessKey: config.minio.secretKey,
      },
      forcePathStyle: true,
    });

    // Best-effort: ensure bucket exists and CORS is configured for browser uploads
    this.ensureBucketAndCors().catch((err) => {
      console.warn("StorageService: Failed to ensure bucket/CORS:", err);
    });
  }

  private async ensureBucketAndCors() {
    // Check if bucket exists
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName })
      );
    } catch (e) {
      // Create if missing
      await this.s3Client.send(
        new CreateBucketCommand({ Bucket: this.bucketName })
      );
    }

    // Configure CORS to allow browser direct PUTs
    const allowedOrigins =
      config.env === "production"
        ? [config.frontendUrl]
        : ["http://127.0.0.1:3000", "http://localhost:3000", config.frontendUrl];
    const corsConfig: CORSConfiguration = {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "GET", "POST", "HEAD"],
          AllowedOrigins: allowedOrigins,
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    };
    try {
      await this.s3Client.send(
        new PutBucketCorsCommand({
          Bucket: this.bucketName,
          CORSConfiguration: corsConfig,
        })
      );
    } catch (err) {
      // Non-fatal if we lack permission; uploads may still work if CORS was set manually
      console.info("StorageService: Skipping CORS setup:", (err as Error).message);
    }

    // Ensure bucket policy allows public read of objects so images can be fetched without auth
    const publicReadPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };
    try {
      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: this.bucketName,
          Policy: JSON.stringify(publicReadPolicy),
        })
      );
    } catch (err) {
      console.info("StorageService: Skipping bucket policy setup:", (err as Error).message);
    }
  }

  async getPresignedUploadUrl(contentType: string) {
    const key = randomUUID();
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.signerClient, command, {
      expiresIn: 300,
    });
    return { uploadUrl, key };
  }
}
