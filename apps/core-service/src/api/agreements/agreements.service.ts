// File Path: apps/core-service/src/api/agreements/agreements.service.ts

import { AgreementRepository } from "./agreements.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js";
import { DocusignService } from "../../services/docusign.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { Property, Project, User } from "@prisma/client";
import { config } from "../../config/index.js";

export type PropertyWithProject = Property & { project: Project | null };

export class AgreementService {
  private agreementRepository: AgreementRepository;
  private propertyRepository: PropertyRepository;
  private docusignService: DocusignService;

  constructor(
    agreementRepository: AgreementRepository,
    propertyRepository: PropertyRepository,
    docusignService: DocusignService
  ) {
    this.agreementRepository = agreementRepository;
    this.propertyRepository = propertyRepository;
    this.docusignService = docusignService;
  }

  /**
   * Creates a new booking request for a property.
   * @param propertyId The ID of the property to book.
   * @param tenantId The ID of the user making the request.
   * @param startDate The start date of the tenancy.
   * @param endDate The end date of the tenancy.
   * @returns The newly created agreement.
   */
  async createAgreement(
    propertyId: number,
    tenantId: number,
    startDate: string,
    endDate: string
  ) {
    const property = await this.propertyRepository.findPropertyById(propertyId);
    if (!property || property.status !== "APPROVED") {
      throw new ApiError(
        404,
        "Property not found or not available for booking."
      );
    }
    if (property.listedById === tenantId) {
      throw new ApiError(400, "You cannot book your own property.");
    }
    const agreementData = {
      propertyId: data.propertyId,
      tenantId: tenantId,
      ownerId: property.listedById,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      rentAmount: property.rentalPrice || 0,
    };
    return this.agreementRepository.create(agreementData);
  }

  async getAgreementsForUser(userId: number) {
    return this.agreementRepository.findByUserId(userId);
  }

  /**
   * Approves a pending tenancy agreement and initiates the DocuSign flow.
   * @param agreementId The ID of the agreement to approve.
   * @param ownerId The ID of the owner approving the agreement.
   * @returns The updated agreement.
   */
  async approveAgreement(agreementId: number, ownerId: number) {
    const agreement = await this.agreementRepository.findById(agreementId);
    if (!agreement) throw new ApiError(404, "Agreement not found.");
    if (agreement.ownerId !== ownerId)
      throw new ApiError(
        403,
        "You do not have permission to approve this agreement."
      );
    if (agreement.status !== "PENDING_OWNER_APPROVAL")
      throw new ApiError(400, "This agreement is not pending approval.");

    const envelopeId =
      await this.docusignService.createAndSendEnvelope(agreement);
    if (!envelopeId)
      throw new ApiError(500, "Failed to create DocuSign envelope.");

    return this.agreementRepository.updateStatusAndEnvelope(
      agreementId,
      "PENDING_SIGNATURES",
      envelopeId
    );
  }

  async getSigningUrl(
    agreementId: number,
    userId: number
  ): Promise<string | undefined> {
    const agreement = await this.agreementRepository.findById(agreementId);
    if (!agreement) {
      throw new ApiError(404, "Agreement not found.");
    }
    if (agreement.ownerId !== userId && agreement.tenantId !== userId) {
      throw new ApiError(403, "You are not a party to this agreement.");
    }
    if (!agreement.docusignEnvelopeId) {
      throw new ApiError(400, "This agreement is not ready for signing.");
    }

    const isOwner = userId === agreement.ownerId;
    const signer = isOwner ? agreement.owner : agreement.tenant;
    const recipientId = isOwner ? "1" : "2";

    const returnUrl = `${config.frontendUrl}/admin/agreements?signing=complete`;

    return this.docusignService.getRecipientViewUrl(
      agreement.docusignEnvelopeId,
      signer,
      recipientId,
      returnUrl
    );
  }

  async getAgreementDocument(
    agreementId: number,
    userId: number
  ): Promise<Buffer> {
    const agreement = await this.agreementRepository.findById(agreementId);
    if (!agreement) {
      throw new ApiError(404, "Agreement not found.");
    }
    if (agreement.ownerId !== userId && agreement.tenantId !== userId) {
      throw new ApiError(403, "You are not a party to this agreement.");
    }
    if (agreement.status !== "ACTIVE" && agreement.status !== "COMPLETED") {
      throw new ApiError(
        400,
        "Document is not available for download until it is completed."
      );
    }
    if (!agreement.docusignEnvelopeId) {
      throw new ApiError(
        400,
        "DocuSign document not found for this agreement."
      );
    }

    return this.docusignService.downloadDocument(agreement.docusignEnvelopeId);
  }
}
