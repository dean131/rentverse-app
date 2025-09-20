// File Path: apps/core-service/src/api/agreements/agreements.service.ts
import { AgreementRepository } from "./agreements.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js";
import { DocusignService } from "../../services/docusign.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { Property, Project } from "@prisma/client";

// Define and export a more specific type that includes the nested project data
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

  async createAgreement(
    data: { propertyId: number; startDate: Date; endDate: Date },
    tenantId: number
  ) {
    const property = await this.propertyRepository.findPropertyById(
      data.propertyId
    );
    if (!property) {
      throw new ApiError(
        404,
        "Property not found or is not available for booking"
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

  async approveAgreement(agreementId: number, ownerId: number) {
    const agreement = await this.agreementRepository.findById(agreementId);

    if (!agreement) throw new ApiError(404, "Agreement not found.");
    if (agreement.ownerId !== ownerId)
      throw new ApiError(
        403,
        "You are not authorized to approve this agreement."
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
}
