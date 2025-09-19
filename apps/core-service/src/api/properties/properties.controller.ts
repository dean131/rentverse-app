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

  createProperty = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      // CORRECTED: The user object from the middleware has an 'id' property, not 'userId'.
      const userId = req.user?.id;
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

  getPublicProperties = asyncHandler(async (req: Request, res: Response) => {
    const searchQuery = req.query.search as string | undefined;
    const propertyType = req.query.propertyType as string | undefined;
    const beds = req.query.beds as string | undefined;

    const properties = await this.propertyService.getPublicProperties({
      searchQuery,
      propertyType,
      beds,
    });
    ApiResponse.success(res, properties);
  });

  getPropertyById = asyncHandler(async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.id, 10);
    if (isNaN(propertyId)) {
      throw new ApiError(400, "Invalid property ID provided.");
    }
    const property = await this.propertyService.getPropertyById(propertyId);
    ApiResponse.success(res, property);
  });
}
