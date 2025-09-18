// File Path: apps/core-service/src/api/properties/properties.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Property, Prisma, PropertyStatus } from "@prisma/client";

export class PropertyRepository {
  async createProperty(data: Prisma.PropertyCreateInput): Promise<Property> {
    return prisma.property.create({
      data,
    });
  }

  async findAllPublic(searchQuery?: string): Promise<any[]> {
    const whereClause: Prisma.PropertyWhereInput = {
      status: PropertyStatus.APPROVED,
    };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          project: { address: { contains: searchQuery, mode: "insensitive" } },
        },
      ];
    }

    return prisma.property.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        listingType: true,
        rentalPrice: true,
        paymentPeriod: true,
        bedrooms: true,
        bathrooms: true,
        sizeSqft: true,
        project: {
          select: {
            address: true,
          },
        },
        images: {
          select: {
            imageUrl: true,
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });
  }
}
