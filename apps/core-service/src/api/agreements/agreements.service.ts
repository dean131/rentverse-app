// File Path: apps/core-service/src/api/agreements/agreements.service.ts
import { AgreementRepository } from "./agreements.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class AgreementService {
  private agreementRepository: AgreementRepository;
  private propertyRepository: PropertyRepository;

  constructor(
    agreementRepository: AgreementRepository,
    propertyRepository: PropertyRepository
  ) {
    this.agreementRepository = agreementRepository;
    this.propertyRepository = propertyRepository;
  }

  async createAgreement(
    data: { propertyId: number; startDate: Date; endDate: Date },
    tenantId: number
  ) {
    // 1. Verify the property exists and is approved
    const property = await this.propertyRepository.findPropertyById(
      data.propertyId
    );
    if (!property) {
      throw new ApiError(
        404,
        "Property not found or is not available for booking"
      );
    }

    // 2. Prevent the owner from booking their own property
    if (property.listedById === tenantId) {
      throw new ApiError(400, "You cannot book your own property.");
    }

    // 3. Prepare the data for the new agreement
    const agreementData = {
      propertyId: data.propertyId,
      tenantId: tenantId,
      ownerId: property.listedById,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      rentAmount: property.rentalPrice || 0, // Use the listed rental price
    };

    // 4. Create the agreement in the database
    return this.agreementRepository.create(agreementData);
  }

  async getAgreementsForUser(userId: number) {
    return this.agreementRepository.findByUserId(userId);
  }
}
