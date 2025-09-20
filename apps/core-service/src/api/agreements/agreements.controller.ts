// File Path: apps/core-service/src/api/agreements/agreements.controller.ts
import { Response } from "express";
import { AgreementService } from "./agreements.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/ApiError.js";

export class AgreementController {
  private agreementService: AgreementService;

  constructor(agreementService: AgreementService) {
    this.agreementService = agreementService;
  }

  createAgreement = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const tenantId = req.user?.id;
      if (!tenantId) {
        throw new ApiError(401, "User not authenticated");
      }
      const agreement = await this.agreementService.createAgreement(
        req.body,
        tenantId
      );
      ApiResponse.created(res, agreement);
    }
  );

  getMyAgreements = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }
      const agreements =
        await this.agreementService.getAgreementsForUser(userId);
      ApiResponse.success(res, agreements);
    }
  );
}
