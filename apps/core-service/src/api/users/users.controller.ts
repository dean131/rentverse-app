// File Path: apps/core-service/src/api/users/users.controller.ts
import { Response } from "express";
import { UserService } from "./users.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/ApiError.js";
import { Role } from "@prisma/client";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUserDashboard = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      // The user's ID and role are attached to the request by the `protect` middleware.
      const userId = req.user?.userId;
      const userRole = req.user?.role as Role;

      if (!userId || !userRole) {
        throw new ApiError(401, "User not authenticated or role is missing.");
      }

      const dashboardData = await this.userService.getDashboardData(
        userId,
        userRole
      );

      ApiResponse.success(res, dashboardData);
    }
  );
}
