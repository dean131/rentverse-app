// File Path: apps/core-service/src/api/admin/admin.controller.ts

import { Response, NextFunction } from "express";
import { AdminService } from "./admin.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { updatePropertyStatusValidation } from "./admin.validation.js";

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  getPendingProperties = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const pendingProperties = await this.adminService.getPendingProperties();
      ApiResponse.success(res, pendingProperties);
    }
  );

  updatePropertyStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const propertyId = parseInt(req.params.id);
      const { status } = updatePropertyStatusValidation.parse(req.body);
      const updatedProperty = await this.adminService.updatePropertyStatus(
        propertyId,
        status
      );
      ApiResponse.success(res, updatedProperty);
    }
  );
}
