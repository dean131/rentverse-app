// File Path: apps/core-service/src/api/properties/properties.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Property, Prisma, PropertyStatus } from "@prisma/client";

export class PropertyRepository {
  async createProperty(data: Prisma.PropertyCreateInput): Promise<Property> {
    return prisma.property.create({
      data,
    });
  }

  // New method to find only properties with 'APPROVED' status
  async findApprovedProperties(): Promise<any[]> {
    return prisma.property.findMany({
      where: {
        status: PropertyStatus.APPROVED,
      },
      select: {
        id: true,
        title: true,
        rentalPrice: true,
        bedrooms: true,
        bathrooms: true,
        sizeSqft: true,
        // Include the first image as a preview
        images: {
          select: {
            imageUrl: true,
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  }
}
