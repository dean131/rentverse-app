// File Path: apps/core-service/src/services/storage.service.ts
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketCorsCommand,
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
    this.signerClient = new S3Client({
      endpoint: config.minio.publicUrl,
      region: "us-east-1",
      credentials: {
        accessKeyId: config.minio.accessKey,
        secretAccessKey: config.minio.secretKey,
      },
      forcePathStyle: true,
    });

    // Initialize the bucket and CORS settings.
    this.initializeBucket().catch((err) => {
      console.error(
        "StorageService: Failed to initialize bucket and CORS:",
        err
      );
    });
  }

  private async initializeBucket() {
    // Step 1: Check if the bucket exists.
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName })
      );
      console.log(
        `StorageService: Bucket "${this.bucketName}" already exists.`
      );
    } catch (e: any) {
      // Step 2: If the bucket does not exist, create it.
      if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) {
        console.log(
          `StorageService: Bucket "${this.bucketName}" not found. Creating...`
        );
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.bucketName })
          );
          console.log(
            `StorageService: Bucket "${this.bucketName}" created successfully.`
          );
        } catch (createErr) {
          console.error(
            `StorageService: FATAL - Failed to create bucket:`,
            createErr
          );
          throw createErr; // Stop if we can't create the bucket
        }
      } else {
        // Re-throw other unexpected errors
        console.error(
          `StorageService: Error checking for bucket existence:`,
          e
        );
        throw e;
      }
    }

    // Step 3: Now that the bucket is guaranteed to exist, apply CORS configuration.
    const allowedOrigins = config.cors.allowedOrigins
      .split(",")
      .map((origin) => origin.trim());
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
      console.log(
        `StorageService: Applying CORS configuration to bucket "${this.bucketName}".`
      );
      await this.s3Client.send(
        new PutBucketCorsCommand({
          Bucket: this.bucketName,
          CORSConfiguration: corsConfig,
        })
      );
      console.log("StorageService: CORS configuration applied successfully.");
    } catch (err) {
      console.warn(
        "StorageService: Could not apply CORS configuration. This may be okay if it's already set. Error:",
        (err as Error).message
      );
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
