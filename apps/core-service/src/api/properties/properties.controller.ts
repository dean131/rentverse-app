import { Response } from "express";
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
      // Get the user ID from the token payload (attached by the `protect` middleware)
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
}
