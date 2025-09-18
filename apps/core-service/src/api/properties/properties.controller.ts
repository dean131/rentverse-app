// File Path: apps/core-service/src/api/properties/properties.controller.ts
import { Response, Request } from "express";
import { PropertyService } from "./properties.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/ApiError.js";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  createProperty = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const newProperty = await this.propertyService.createProperty(
        req.body,
        userId
      );
      ApiResponse.created(res, newProperty);
    }
  );

  // New method for the public endpoint
  getPublicProperties = asyncHandler(async (req: Request, res: Response) => {
    const properties = await this.propertyService.getApprovedProperties();
    ApiResponse.success(res, properties);
  });
}
