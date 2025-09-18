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

  // NEW: Repository method to fetch a single, approved property with all its relations.
  async findPropertyById(id: number) {
    return prisma.property.findUnique({
      where: {
        id: id,
        status: PropertyStatus.APPROVED, // Ensure only approved properties can be fetched
      },
      include: {
        listedBy: {
          // Include information about the owner
          select: {
            fullName: true,
            email: true, // For a contact form
            profilePictureUrl: true,
          },
        },
        project: {
          // Include project details
          select: {
            projectName: true,
            address: true,
          },
        },
        images: {
          // Get all images
          orderBy: { displayOrder: "asc" },
        },
        amenities: {
          // Get all linked amenities
          include: {
            amenity: true,
          },
        },
        views: {
          // Get all linked views
          include: {
            view: true,
          },
        },
      },
    });
  }
}
