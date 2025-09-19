// File Path: apps/core-service/src/api/views/views.controller.ts
import { Request, Response } from "express";
import { ViewService } from "./views.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class ViewController {
  private viewService: ViewService;

  constructor(viewService: ViewService) {
    this.viewService = viewService;
  }

  getAllViews = asyncHandler(async (req: Request, res: Response) => {
    const views = await this.viewService.getAllViews();
    ApiResponse.success(res, views);
  });
}
