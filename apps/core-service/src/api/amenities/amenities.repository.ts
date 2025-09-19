// File Path: apps/core-service/src/api/amenities/amenities.repository.ts
import { prisma } from "../../lib/prisma.js";

export class AmenityRepository {
  async findAll() {
    return prisma.amenity.findMany();
  }
}
