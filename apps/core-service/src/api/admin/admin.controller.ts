// File Path: apps/core-service/src/api/admin/admin.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { AdminService } from "./admin.service.js";

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  getPendingProperties = asyncHandler(async (req: Request, res: Response) => {
    const properties = await this.adminService.findPendingProperties();
    ApiResponse.success(res, properties);
  });

  updatePropertyStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updatedProperty = await this.adminService.updatePropertyStatus(
      Number(id),
      status
    );
    ApiResponse.success(res, updatedProperty);
  });

  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.adminService.getDashboardStats();
    ApiResponse.success(res, stats);
  });
}
