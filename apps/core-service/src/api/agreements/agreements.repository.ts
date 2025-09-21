// File Path: apps/core-service/src/api/agreements/agreements.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Prisma, TenancyStatus } from "@prisma/client";

export class AgreementRepository {
  async create(data: Prisma.TenancyAgreementUncheckedCreateInput) {
    return prisma.tenancyAgreement.create({ data });
  }

  async findById(id: number) {
    return prisma.tenancyAgreement.findUnique({
      where: { id },
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
