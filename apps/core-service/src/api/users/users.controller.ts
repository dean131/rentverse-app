// File Path: apps/core-service/src/api/users/users.controller.ts
import { Response } from "express";
import { UserService } from "./users.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/ApiError.js";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUserDashboard = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = req.user;
      if (!user) {
        throw new ApiError(401, "User not authenticated to access dashboard");
      }
      const dashboardData = await this.userService.getUserDashboard(user);
      ApiResponse.success(res, dashboardData);
    }
  );
}
