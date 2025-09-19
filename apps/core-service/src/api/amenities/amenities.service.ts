// File Path: apps/core-service/src/api/amenities/amenities.service.ts
import { AmenityRepository } from "./amenities.repository.js";

export class AmenityService {
  private amenityRepository: AmenityRepository;

  constructor(amenityRepository: AmenityRepository) {
    this.amenityRepository = amenityRepository;
  }

  async getAllAmenities() {
    return this.amenityRepository.findAll();
  }
}
