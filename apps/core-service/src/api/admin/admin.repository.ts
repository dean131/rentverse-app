import { prisma } from "../../lib/prisma.js";
import { Property, PropertyStatus } from "@prisma/client";

const USER_PAGE_SIZE = 10;

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
        id: "asc",
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

  async getAdminDashboardStats() {
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

  async findAllUsers(page: number) {
    const skip = (page - 1) * USER_PAGE_SIZE;
    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          role: {
            not: "ADMIN",
          },
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          profilePictureUrl: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: USER_PAGE_SIZE,
        skip: skip,
      }),
      prisma.user.count({
        where: {
          role: {
            not: "ADMIN",
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / USER_PAGE_SIZE);
    return { items: users, totalPages, currentPage: page };
  }
}
