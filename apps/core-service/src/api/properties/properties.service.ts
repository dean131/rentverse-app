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
    // UPDATED: Now expects an `images` array of objects with URLs
    const {
      viewIds,
      amenityIds,
      ownershipDocumentUrl,
      projectId,
      images,
      ...restOfData
    } = propertyData;

    const dataToCreate = {
      ...restOfData,
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
      // ADDED: Logic to create the property images from the provided URLs
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

  // CORRECTED: The type definition for the filters object now includes the optional 'beds' property.
  async getPublicProperties(filters: {
    searchQuery?: string;
    propertyType?: string;
    beds?: string;
  }): Promise<any[]> {
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

    const formattedProperty = {
      ...property,
      amenities: property.amenities.map((pa) => pa.amenity),
      views: property.views.map((pv) => pv.view),
    };

    return formattedProperty;
  }
}
