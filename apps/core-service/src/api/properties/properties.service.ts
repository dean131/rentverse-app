// File Path: apps/core-service/src/api/properties/properties.service.ts
import { Property } from "@prisma/client";
import { PropertyRepository } from "./properties.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor(propertyRepository: PropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async createProperty(propertyData: any, userId: number): Promise<Property> {
    const {
      viewIds,
      amenityIds,
      ownershipDocumentUrl,
      projectId,
      address,
      images,
      ...restOfData
    } = propertyData;

    if (!projectId && !address) {
      throw new ApiError(400, "Either a project or an address is required.");
    }

    const dataToCreate = {
      ...restOfData,
      address: address,
      listedBy: { connect: { id: userId } },
      ...(projectId && {
        project: { connect: { id: parseInt(projectId, 10) } },
      }),
      ...(viewIds &&
        viewIds.length > 0 && {
          views: {
            create: viewIds.map((id: number) => ({
              view: { connect: { id } },
            })),
          },
        }),
      ...(amenityIds &&
        amenityIds.length > 0 && {
          amenities: {
            create: amenityIds.map((id: number) => ({
              amenity: { connect: { id } },
            })),
          },
        }),
      documents: {
        create: {
          fileUrl: ownershipDocumentUrl,
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
      ...(images &&
        images.length > 0 && {
          images: {
            create: images.map(
              (img: { imageUrl: string; displayOrder: number }) => ({
                imageUrl: img.imageUrl,
                displayOrder: img.displayOrder,
              })
            ),
          },
        }),
    };
    return this.propertyRepository.createProperty(dataToCreate);
  }

  async getPublicProperties(filters: {
    searchQuery?: string;
    propertyType?: string;
    beds?: string;
    page?: number;
    listingType?: string;
  }): Promise<any> {
    return this.propertyRepository.findAllPublic(filters);
  }

  async getPropertyById(id: number): Promise<any> {
    const property = await this.propertyRepository.findPropertyById(id);
    if (!property) {
      throw new ApiError(
        404,
        "Property not found or is not approved for public viewing."
      );
    }
    // Make sure there's an address field to display
    if (!property.address && !property.project?.address) {
      throw new ApiError(404, "Property address details are incomplete.");
    }

    const formattedProperty = {
      ...property,
      address: property.address || property.project?.address,
      amenities: property.amenities.map((pa) => pa.amenity),
      views: property.views.map((pv) => pv.view),
    };

    return formattedProperty;
  }

  async getPropertiesForOwner(userId: number): Promise<any[]> {
    return this.propertyRepository.findByOwnerId(userId);
  }
}
