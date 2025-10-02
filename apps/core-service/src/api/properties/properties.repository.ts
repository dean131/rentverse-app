// File Path: apps/core-service/src/api/properties/properties.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Property, Prisma, PropertyStatus, PropertyType } from "@prisma/client";

const ITEMS_PER_PAGE = 9;

export class PropertyRepository {
  async createProperty(data: Prisma.PropertyCreateInput): Promise<Property> {
    return prisma.property.create({
      data,
    });
  }

  async findAllPublic(filters: {
    searchQuery?: string;
    listingType?: string;
    propertyType?: string;
    beds?: string;
    page?: number;
  }): Promise<{ items: any[]; totalPages: number; currentPage: number }> {
    const page = filters.page || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const whereClause: Prisma.PropertyWhereInput = {
      status: PropertyStatus.APPROVED,
    };

    if (filters.searchQuery) {
      whereClause.OR = [
        { title: { contains: filters.searchQuery, mode: "insensitive" } },
        { description: { contains: filters.searchQuery, mode: "insensitive" } },
        { address: { contains: filters.searchQuery, mode: "insensitive" } },
        {
          project: {
            address: { contains: filters.searchQuery, mode: "insensitive" },
          },
        },
      ];
    }

    // New logic for listingType
    if (filters.listingType) {
      if (filters.listingType === "RENT") {
        whereClause.listingType = { in: ["RENT", "BOTH"] };
      } else if (filters.listingType === "SALE") {
        whereClause.listingType = { in: ["SALE", "BOTH"] };
      }
    }

    if (filters.propertyType && filters.propertyType !== "ALL") {
      whereClause.propertyType = filters.propertyType as PropertyType;
    }

    if (filters.beds) {
      const minBeds = parseInt(filters.beds, 10);
      if (!isNaN(minBeds)) {
        whereClause.bedrooms = { gte: minBeds };
      }
    }

    const [items, totalCount] = await prisma.$transaction([
      prisma.property.findMany({
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
          address: true,
          project: { select: { address: true } },
          images: {
            select: { imageUrl: true },
            orderBy: { displayOrder: "asc" },
          },
        },
        skip: skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.property.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return { items, totalPages, currentPage: page };
  }

  async findPropertyById(id: number) {
    return prisma.property.findUnique({
      where: {
        id: id,
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
        documents: true,
        amenities: {
          include: { amenity: true },
        },
        views: {
          include: { view: true },
        },
      },
    });
  }

  async findByOwnerId(userId: number) {
    return prisma.property.findMany({
      where: {
        listedById: userId,
      },
      select: {
        id: true,
        title: true,
        propertyType: true,
        status: true,
        createdAt: true,
        images: {
          take: 1,
          select: { imageUrl: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

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
