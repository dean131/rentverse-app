// File Path: apps/core-service/src/api/uploads/uploads.controller.ts
import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { StorageService } from "../../services/storage.service.js";

export class UploadController {
  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  getPresignedUrl = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { contentType } = req.body;
      console.info(`BACKEND: ${contentType}`);
      if (!contentType) {
        throw new ApiError(400, "Content type of the file is required.");
      }
      const result =
        await this.storageService.getPresignedUploadUrl(contentType);
      ApiResponse.success(res, result);
    }
  );
}
