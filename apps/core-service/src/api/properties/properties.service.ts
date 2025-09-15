import { Property } from "@prisma/client";
import { PropertyRepository } from "./properties.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor(propertyRepository: PropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async createProperty(propertyData: any, userId: number): Promise<Property> {
    const { viewIds, ownershipDocumentUrl, ...restOfData } = propertyData;

    // Construct the data payload for Prisma
    const dataToCreate = {
      ...restOfData,
      listedBy: {
        connect: { id: userId }, // Connect to the logged-in user
      },
      // Connect to views if they were provided
      ...(viewIds &&
        viewIds.length > 0 && {
          views: {
            create: viewIds.map((id: number) => ({
              view: { connect: { id } },
            })),
          },
        }),
      // Create the ownership document record
      documents: {
        create: {
          fileUrl: ownershipDocumentUrl,
          documentType: "OWNERSHIP_CERTIFICATE", // Defaulting for now
        },
      },
    };

    return this.propertyRepository.createProperty(dataToCreate);
  }
}
