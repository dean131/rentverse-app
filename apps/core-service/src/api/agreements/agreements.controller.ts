// File Path: apps/core-service/src/api/agreements/agreements.controller.ts

import { Request, Response, NextFunction } from "express";
import { AgreementService } from "./agreements.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.helper.js";
import {
  createAgreementValidation,
  updateAgreementStatusValidation,
} from "./agreements.validation.js";

export class AgreementController {
  private agreementService: AgreementService;

  constructor(agreementService: AgreementService) {
    this.agreementService = agreementService;
  }

  /**
   * Creates a new booking request for a property.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
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

  /**
   * Gets all agreements for the currently authenticated user.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  getMyAgreements = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      const userId = req.user.id;
      const agreements = await this.agreementService.getMyAgreements(userId);

      // Use the `success` method for a 200 response.
      ApiResponse.success(res, agreements);
    }
  );

  approveAgreement = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const agreementId = parseInt(req.params.id);
      // @ts-ignore
      const ownerId = req.user.id;

      updateAgreementStatusValidation.parse({ status: "APPROVED" });

      const updatedAgreement = await this.agreementService.approveAgreement(
        agreementId,
        ownerId
      );

      // Use the `success` method for a 200 response.
      ApiResponse.success(res, updatedAgreement);
    }
  );

  /**
   * Updates the status of a pending agreement to 'REJECTED'.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  rejectAgreement = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const agreementId = parseInt(req.params.id);
      // @ts-ignore
      const ownerId = req.user.id;

      updateAgreementStatusValidation.parse({ status: "REJECTED" });

      const updatedAgreement = await this.agreementService.rejectAgreement(
        agreementId,
        ownerId
      );

      // Use the `success` method for a 200 response.
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
}
