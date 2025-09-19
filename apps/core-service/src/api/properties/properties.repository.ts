// File Path: apps/core-service/src/api/properties/properties.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Property, Prisma, PropertyStatus, PropertyType } from "@prisma/client";

export class PropertyRepository {
  async createProperty(data: Prisma.PropertyCreateInput): Promise<Property> {
    return prisma.property.create({
      data,
    });
  }

  async findAllPublic(filters: {
    searchQuery?: string;
    propertyType?: string;
    beds?: string;
  }): Promise<any[]> {
    const whereClause: Prisma.PropertyWhereInput = {
      status: PropertyStatus.APPROVED,
    };

    if (filters.searchQuery) {
      whereClause.OR = [
        { title: { contains: filters.searchQuery, mode: "insensitive" } },
        { description: { contains: filters.searchQuery, mode: "insensitive" } },
        {
          project: {
            address: { contains: filters.searchQuery, mode: "insensitive" },
          },
        },
      ];
    }

    if (filters.propertyType && filters.propertyType !== "ALL") {
      whereClause.propertyType = filters.propertyType as PropertyType;
    }

    if (filters.beds) {
      const minBeds = parseInt(filters.beds, 10);
      if (!isNaN(minBeds)) {
        whereClause.bedrooms = {
          gte: minBeds,
        };
      }
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
        project: { select: { address: true } },
        images: {
          select: { imageUrl: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });
  }

  async findPropertyById(id: number) {
    return prisma.property.findUnique({
      where: {
        id: id,
        status: PropertyStatus.APPROVED,
      },
      include: {
        listedBy: {
          select: {
            fullName: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        project: {
          select: {
            projectName: true,
            address: true,
          },
        },
        images: {
          orderBy: { displayOrder: "asc" },
        },
        amenities: {
          include: { amenity: true },
        },
        views: {
          include: { view: true },
        },
      },
    });
  }

  /**
   * NEW METHOD: Fetches statistics for a specific property owner's listings.
   * Counts properties by their status (PENDING, APPROVED, REJECTED).
   */
  async getUserPropertyStats(userId: number) {
    const stats = await prisma.property.groupBy({
      by: ["status"],
      where: {
        listedById: userId,
      },
      _count: {
        id: true, // Count the number of properties in each group
      },
    });

    const statsMap = {
      totalListings: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    for (const stat of stats) {
      const count = stat._count.id;
      statsMap.totalListings += count;
      switch (stat.status) {
        case PropertyStatus.PENDING:
          statsMap.pending = count;
          break;
        case PropertyStatus.APPROVED:
          statsMap.approved = count;
          break;
        case PropertyStatus.REJECTED:
          statsMap.rejected = count;
          break;
      }
    }
    return statsMap;
  }
}
