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
      // req.user.id from the middleware is a number
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

  approveAgreement = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(401, "User not authenticated");

      const agreementId = parseInt(req.params.id, 10);
      if (isNaN(agreementId)) throw new ApiError(400, "Invalid agreement ID.");

      const updatedAgreement = await this.agreementService.approveAgreement(
        agreementId,
        ownerId
      );
      ApiResponse.success(res, updatedAgreement);
    }
  );

  getSigningUrl = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(401, "User not authenticated");

      const agreementId = parseInt(req.params.id, 10);
      if (isNaN(agreementId)) throw new ApiError(400, "Invalid agreement ID.");

      const signingUrl = await this.agreementService.getSigningUrl(
        agreementId,
        userId
      );
      ApiResponse.success(res, { url: signingUrl });
    }
  );

  downloadAgreementDocument = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(401, "User not authenticated");

      const agreementId = parseInt(req.params.id, 10);
      if (isNaN(agreementId)) throw new ApiError(400, "Invalid agreement ID.");

      const pdfBuffer = await this.agreementService.getAgreementDocument(
        agreementId,
        userId
      );

      // Set headers to trigger browser download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="tenancy-agreement-${agreementId}.pdf"`
      );
      res.send(pdfBuffer);
    }
  );
}
