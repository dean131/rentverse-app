// File Path: apps/core-service/src/api/admin/admin.controller.ts
import { Response } from "express";
import { AdminService } from "./admin.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  getPendingProperties = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const properties = await this.adminService.getPendingProperties();
      ApiResponse.success(res, properties);
    }
  );

  updatePropertyStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const propertyId = parseInt(req.params.id, 10);
      const { status } = req.body;

      const updatedProperty = await this.adminService.updatePropertyStatus(
        propertyId,
        status
      );
      ApiResponse.success(res, updatedProperty);
    }
  );
}
