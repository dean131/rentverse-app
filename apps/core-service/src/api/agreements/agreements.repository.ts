// File Path: apps/core-service/src/api/agreements/agreements.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Prisma, TenancyStatus } from "@prisma/client";

export class AgreementRepository {
  /**
   * Creates a new tenancy agreement in the database.
   * @param data The data for the new agreement.
   * @returns The newly created agreement.
   */
  async create(data: Prisma.TenancyAgreementUncheckedCreateInput) {
    return prisma.tenancyAgreement.create({ data });
  }

  async findById(id: number) {
    return prisma.tenancyAgreement.findUnique({
      where: { id },
      include: {
        tenant: true,
        owner: true,
        property: {
          include: {
            project: true,
          },
        },
      },
    });
  }

  // NEW: Update the status and DocuSign envelope ID of an agreement
  async updateStatusAndEnvelope(
    id: number,
    status: TenancyStatus,
    envelopeId: string
  ) {
    return prisma.tenancyAgreement.update({
      where: { id },
      data: { status, docusignEnvelopeId: envelopeId },
    });
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
