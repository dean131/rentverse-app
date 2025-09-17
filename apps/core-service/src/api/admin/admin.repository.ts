// File Path: apps/core-service/src/api/admin/admin.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Property, PropertyStatus } from "@prisma/client";

export class AdminRepository {
  /**
   * Finds all properties with a 'PENDING' status.
   */
  async findPendingProperties(): Promise<Property[]> {
    return prisma.property.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        listedBy: {
          // Include basic user info
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Updates the status of a specific property.
   * @param id - The ID of the property to update.
   * @param status - The new status ('APPROVED' or 'REJECTED').
   */
  async updatePropertyStatus(
    id: number,
    status: PropertyStatus
  ): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data: { status },
    });
  }
}
