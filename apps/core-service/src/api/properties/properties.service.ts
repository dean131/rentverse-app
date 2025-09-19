// File Path: apps/core-service/src/api/properties/properties.service.ts
import { Property, PropertyType } from "@prisma/client";
import { PropertyRepository } from "./properties.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor(propertyRepository: PropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async createProperty(propertyData: any, userId: number): Promise<Property> {
    // UPDATED: Destructure amenityIds from the incoming data
    const {
      viewIds,
      amenityIds,
      ownershipDocumentUrl,
      projectId,
      ...restOfData
    } = propertyData;

    const dataToCreate = {
      ...restOfData,
      listedBy: { connect: { id: userId } },
      ...(projectId && { project: { connect: { id: projectId } } }),
      ...(viewIds &&
        viewIds.length > 0 && {
          views: {
            create: viewIds.map((id: number) => ({
              view: { connect: { id } },
            })),
          },
        }),
      // ADDED: Logic to connect the selected amenities to the new property
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
    };
    return this.propertyRepository.createProperty(dataToCreate);
  }

  async getPublicProperties(filters: {
    searchQuery?: string;
    propertyType?: string;
  }): Promise<any[]> {
    return this.propertyRepository.findAllPublic(filters);
  }

  // NEW: Service method to find a property by ID and handle "not found" cases.
  async getPropertyById(id: number): Promise<any> {
    const property = await this.propertyRepository.findPropertyById(id);
    if (!property) {
      throw new ApiError(
        404,
        "Property not found or is not approved for public viewing."
      );
    }

    // Reshape the data to be more frontend-friendly
    const formattedProperty = {
      ...property,
      amenities: property.amenities.map((pa) => pa.amenity),
      views: property.views.map((pv) => pv.view),
    };

    return formattedProperty;
  }
}
