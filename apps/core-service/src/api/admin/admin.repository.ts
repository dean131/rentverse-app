// File Path: apps/core-service/src/api/admin/admin.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Property, PropertyStatus } from "@prisma/client";

export class AdminRepository {
  async findPendingProperties(): Promise<any[]> {
    return prisma.property.findMany({
      where: {
        status: PropertyStatus.PENDING,
      },
      include: {
        listedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: "asc", // Consistently order by ID
      },
    });
  }

  async updatePropertyStatus(
    id: number,
    status: PropertyStatus
  ): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * NEW METHOD: Fetches aggregate statistics for the admin dashboard.
   */
  async getAdminDashboardStats() {
    // Use Prisma's transaction feature to run multiple queries concurrently for efficiency
    const [
      totalDocuments,
      registeredUsers,
      pendingProperties,
      documentsThisMonth,
    ] = await prisma.$transaction([
      prisma.propertyDocument.count(),
      prisma.user.count(),
      prisma.property.count({ where: { status: "PENDING" } }),
      prisma.propertyDocument.count({
        where: {
          uploadedAt: {
            // Filter for documents uploaded in the current month
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ),
          },
        },
      }),
    ]);

    return {
      totalDocuments,
      registeredUsers,
      pendingProperties,
      documentsThisMonth,
    };
  }
}
