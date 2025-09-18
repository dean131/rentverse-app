// File Path: apps/core-service/src/api/properties/properties.controller.ts
import { Request, Response } from "express";
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

  // Handles POST /api/properties
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

  // Handles GET /api/properties
  getPublicProperties = asyncHandler(async (req: Request, res: Response) => {
    // Extract the search query from the URL, if it exists
    const searchQuery = req.query.search as string | undefined;

    const properties =
      await this.propertyService.getPublicProperties(searchQuery);
    ApiResponse.success(res, properties);
  });
}
