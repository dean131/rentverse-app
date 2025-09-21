// File Path: apps/core-service/src/api/agreements/agreements.service.ts

import { AgreementRepository } from "./agreements.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js";
import { DocusignService } from "../../services/docusign.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { TenancyStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
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

    // Check for existing agreements that overlap with the new dates
    const existingAgreements =
      await this.agreementRepository.findAgreementsForUser(tenantId);
    const hasOverlap = existingAgreements.some((agreement) => {
      const existingStart = new Date(agreement.startDate);
      const existingEnd = new Date(agreement.endDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      return newStart <= existingEnd && newEnd >= existingStart;
    });

    if (hasOverlap) {
      throw new ApiError(400, "A booking already exists for these dates.");
    }

    const newAgreement = await this.agreementRepository.createAgreement({
      startDate,
      endDate,
      rentAmount: property.rentalPrice as number, // Assumes rental price is always available
      property: { connect: { id: propertyId } },
      owner: { connect: { id: property.listedById } },
      tenant: { connect: { id: tenantId } },
    });

    return newAgreement;
  }

  /**
   * Fetches all agreements for the current user.
   * @param userId The ID of the authenticated user.
   * @returns A list of agreements.
   */
  async getMyAgreements(userId: number) {
    return this.agreementRepository.findAgreementsForUser(userId);
  }

  /**
   * Approves a pending tenancy agreement and initiates the DocuSign flow.
   * @param agreementId The ID of the agreement to approve.
   * @param ownerId The ID of the owner approving the agreement.
   * @returns The updated agreement.
   */
  async approveAgreement(agreementId: number, ownerId: number) {
    const agreement =
      await this.agreementRepository.findAgreementById(agreementId);
    if (!agreement) {
      throw new ApiError(404, "Agreement not found.");
    }

    // Authorization check
    if (agreement.ownerId !== ownerId) {
      throw new ApiError(
        403,
        "You do not have permission to approve this agreement."
      );
    }

    if (agreement.status !== TenancyStatus.PENDING_OWNER_APPROVAL) {
      throw new ApiError(
        400,
        "Only agreements pending owner approval can be approved."
      );
    }

    // Generate a simple tenancy agreement document (or load a template)
    const documentBase64 = this.docusignService.generateAgreementDocument({
      tenantName: agreement.tenant.fullName,
      tenantEmail: agreement.tenant.email,
      ownerName: agreement.property.listedBy.fullName,
      ownerEmail: agreement.property.listedBy.email,
      propertyTitle: agreement.property.title,
      startDate: agreement.startDate,
      endDate: agreement.endDate,
      rentAmount: agreement.rentAmount,
    });

    // Create a DocuSign envelope with the document and signers
    const { envelopeId, signingUrl } =
      await this.docusignService.createAndSendEnvelope({
        envelopeName: `Tenancy Agreement for ${agreement.property.title}`,
        documentBase64,
        signers: [
          {
            name: agreement.tenant.fullName,
            email: agreement.tenant.email,
            recipientId: "1",
          },
          {
            name: agreement.property.listedBy.fullName,
            email: agreement.property.listedBy.email,
            recipientId: "2",
          },
        ],
      });

    // Update the agreement with the DocuSign envelope ID
    const updatedAgreement =
      await this.agreementRepository.updateAgreementStatus(
        agreementId,
        TenancyStatus.PENDING_SIGNATURES
      );

    // Save the envelopeId for webhook tracking
    await prisma.tenancyAgreement.update({
      where: { id: agreementId },
      data: { docusignEnvelopeId: envelopeId },
    });

    // In a real application, you might also want to notify the tenant to sign
    // this.docusignService.notifySigner(signingUrl);

    return updatedAgreement;
  }

  /**
   * Rejects a pending tenancy agreement.
   * @param agreementId The ID of the agreement to reject.
   * @param ownerId The ID of the owner rejecting the agreement.
   * @returns The updated agreement.
   */
  async rejectAgreement(agreementId: number, ownerId: number) {
    const agreement =
      await this.agreementRepository.findAgreementById(agreementId);
    if (!agreement) {
      throw new ApiError(404, "Agreement not found.");
    }

    if (agreement.ownerId !== ownerId) {
      throw new ApiError(
        403,
        "You do not have permission to reject this agreement."
      );
    }

    if (agreement.status !== TenancyStatus.PENDING_OWNER_APPROVAL) {
      throw new ApiError(
        400,
        "Only agreements pending owner approval can be rejected."
      );
    }

    const updatedAgreement =
      await this.agreementRepository.updateAgreementStatus(
        agreementId,
        TenancyStatus.OWNER_REJECTED
      );
    return updatedAgreement;
  }
}
