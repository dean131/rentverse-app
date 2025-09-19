// File Path: apps/core-service/src/api/users/users.repository.ts
import { prisma } from "../../lib/prisma.js";
import { PropertyStatus } from "@prisma/client";

export class UserRepository {
  /**
   * Calculates property statistics for a specific property owner.
   * @param userId The ID of the property owner.
   * @returns An object with counts of pending, approved, and rejected properties.
   */
  async getUserPropertyStats(userId: number) {
    // We use Prisma's transaction feature to run multiple count queries efficiently.
    const [pendingCount, approvedCount, rejectedCount] =
      await prisma.$transaction([
        prisma.property.count({
          where: { listedById: userId, status: PropertyStatus.PENDING },
        }),
        prisma.property.count({
          where: { listedById: userId, status: PropertyStatus.APPROVED },
        }),
        prisma.property.count({
          where: { listedById: userId, status: PropertyStatus.REJECTED },
        }),
      ]);

    return {
      pendingProperties: pendingCount,
      approvedProperties: approvedCount,
      rejectedProperties: rejectedCount,
    };
  }
}
