// File Path: apps/core-service/src/api/agreements/agreements.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

export class AgreementRepository {
  /**
   * Creates a new tenancy agreement in the database.
   * @param data The data for the new agreement.
   * @returns The newly created agreement.
   */
  async create(data: Prisma.TenancyAgreementUncheckedCreateInput) {
    return prisma.tenancyAgreement.create({ data });
  }

  /**
   * Finds all agreements where the user is either the tenant or the owner.
   * @param userId The ID of the user.
   * @returns A list of the user's agreements.
   */
  async findByUserId(userId: number) {
    return prisma.tenancyAgreement.findMany({
      where: {
        OR: [{ tenantId: userId }, { ownerId: userId }],
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: { take: 1, select: { imageUrl: true } },
          },
        },
        tenant: { select: { fullName: true } },
        owner: { select: { fullName: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
