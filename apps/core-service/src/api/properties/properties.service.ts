import { Property } from "@prisma/client";
import { PropertyRepository } from "./properties.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor(propertyRepository: PropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async createProperty(propertyData: any, userId: number): Promise<Property> {
    // FIXED: Destructure projectId along with the other special fields.
    const { viewIds, ownershipDocumentUrl, projectId, ...restOfData } =
      propertyData;

    // Construct the data payload for Prisma's nested write capabilities
    const dataToCreate = {
      ...restOfData,
      // Connect the property to the user who is creating it
      listedBy: {
        connect: { id: userId },
      },
      // FIXED: If a projectId is provided, create the correct 'connect' object.
      ...(projectId && {
        project: {
          connect: { id: projectId },
        },
      }),
      // If viewIds were provided, create the links in the PropertyView join table
      ...(viewIds &&
        viewIds.length > 0 && {
          views: {
            create: viewIds.map((id: number) => ({
              view: { connect: { id } },
            })),
          },
        }),
      // Create the related ownership document record
      documents: {
        create: {
          fileUrl: ownershipDocumentUrl,
          documentType: "OWNERSHIP_CERTIFICATE", // Defaulting to this type for now
        },
      },
    };

    return this.propertyRepository.createProperty(dataToCreate);
  }
}
