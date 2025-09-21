// File Path: apps/core-service/src/api/users/users.controller.ts

import { Response, NextFunction } from "express";
import { UserService } from "./users.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { ApiError } from "../../utils/ApiError.js"; // Corrected import
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { updateUserProfileValidation } from "./users.validation.js";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getMe = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user || !req.user.id) {
        // Correctly throw an ApiError for an unauthenticated user
        throw new ApiError(401, "User not authenticated.");
      }
      const user = await this.userService.getCurrentUser(req.user.id);
      // Correctly call the static `success` method with the response object and data
      ApiResponse.success(res, user);
    }
  );

  updateProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user || !req.user.id) {
        // Correctly throw an ApiError for an unauthenticated user
        throw new ApiError(401, "User not authenticated.");
      }
      const validatedData = updateUserProfileValidation.parse(req.body);
      const updatedUser = await this.userService.updateProfile(
        req.user.id,
        validatedData
      );
      // Correctly call the static `success` method with the response object and data
      ApiResponse.success(res, updatedUser);
    }
  );
}
