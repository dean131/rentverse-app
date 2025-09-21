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
    async (req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      const tenantId = req.user.id;
      const validatedData = createAgreementValidation.parse(req.body);

      const newAgreement = await this.agreementService.createAgreement(
        validatedData.propertyId,
        tenantId,
        validatedData.startDate,
        validatedData.endDate
      );

      // Use the `created` method for a 201 response.
      ApiResponse.created(res, newAgreement);
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

  /**
   * Updates the status of a pending agreement to 'APPROVED'.
   * This action triggers the DocuSign integration.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
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
}
