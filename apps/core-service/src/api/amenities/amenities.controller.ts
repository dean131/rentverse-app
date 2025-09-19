// File Path: apps/core-service/src/api/amenities/amenities.controller.ts
import { Request, Response } from "express";
import { AmenityService } from "./amenities.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class AmenityController {
  private amenityService: AmenityService;

  constructor(amenityService: AmenityService) {
    this.amenityService = amenityService;
  }

  getAllAmenities = asyncHandler(async (req: Request, res: Response) => {
    const amenities = await this.amenityService.getAllAmenities();
    ApiResponse.success(res, amenities);
  });
}
