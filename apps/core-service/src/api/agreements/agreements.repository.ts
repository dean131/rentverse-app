// File Path: apps/core-service/src/api/agreements/agreements.repository.ts

import { prisma } from "../../lib/prisma.js";
import { Prisma, TenancyStatus } from "@prisma/client";

export class AgreementRepository {
  /**
   * Creates a new tenancy agreement record in the database.
   * @param data The data for the new agreement.
   * @returns The newly created tenancy agreement.
   */
  async createAgreement(data: Prisma.TenancyAgreementCreateInput) {
    return prisma.tenancyAgreement.create({ data });
  }

  async findById(id: number) {
    return prisma.tenancyAgreement.findUnique({
      where: { id: agreementId },
      include: {
        tenant: true,
        owner: true,
        property: { include: { project: true } },
      },
    });
  }

  // CORRECTED: The userId parameter is now correctly typed as a number.
  async findByUserId(userId: number) {
    return prisma.tenancyAgreement.findMany({
      where: {
        OR: [{ ownerId: userId }, { tenantId: userId }],
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: { take: 1, select: { imageUrl: true } },
          },
        },
        tenant: { select: { id: true, fullName: true } },
        owner: { select: { id: true, fullName: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

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

  async updateStatusByEnvelopeId(envelopeId: string, status: TenancyStatus) {
    return prisma.tenancyAgreement.updateMany({
      where: { docusignEnvelopeId: envelopeId },
      data: { status },
    });
  }
}
