// File Path: apps/core-service/src/api/users/users.repository.ts
import { prisma } from "../../lib/prisma.js";
import { PropertyStatus } from "@prisma/client";

export class UserRepository {
  /**
   * Counts the number of properties listed by a specific user, grouped by status.
   * @param userId - The ID of the user.
   * @returns An object with counts for each property status.
   */
  async countPropertiesByStatusForUser(userId: number) {
    // Use Prisma's `groupBy` to efficiently count properties
    const propertyCounts = await prisma.property.groupBy({
      by: ["status"],
      where: {
        listedById: userId,
      },
      _count: {
        id: true,
      },
    });

    // Initialize a result object with all statuses set to 0
    const dashboardStats = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      TOTAL: 0,
    };

    let totalProperties = 0;

    // Map the query results to our result object
    for (const group of propertyCounts) {
      const count = group._count.id;
      if (group.status in dashboardStats) {
        dashboardStats[group.status as keyof typeof dashboardStats] = count;
      }
      totalProperties += count;
    }

    dashboardStats.TOTAL = totalProperties;

    return dashboardStats;
  }
}
