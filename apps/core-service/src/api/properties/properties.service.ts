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
    const { viewIds, ownershipDocumentUrl, projectId, ...restOfData } =
      propertyData;

    const dataToCreate = {
      ...restOfData,
      listedBy: {
        connect: { id: userId },
      },
      ...(projectId && {
        project: {
          connect: { id: projectId },
        },
      }),
      ...(viewIds &&
        viewIds.length > 0 && {
          views: {
            create: viewIds.map((id: number) => ({
              view: { connect: { id } },
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

  // New method to fetch only approved properties
  async getApprovedProperties(): Promise<any[]> {
    return this.propertyRepository.findApprovedProperties();
  }
}
