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
    const filters = {
      searchQuery: req.query.search as string | undefined,
      listingType: req.query.listingType as string | undefined,
      propertyType: req.query.propertyType as string | undefined,
      beds: req.query.beds as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string, 10)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string, 10)
        : undefined,
      amenities: req.query.amenities
        ? (req.query.amenities as string).split(",")
        : undefined,
      furnishing: req.query.furnishing
        ? (req.query.furnishing as string).split(",")
        : undefined,
    };

    const properties = await this.propertyService.getPublicProperties(filters);
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

  getOwnerProperties = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }
      const properties =
        await this.propertyService.getPropertiesForOwner(userId);
      ApiResponse.success(res, properties);
    }
  );
}
