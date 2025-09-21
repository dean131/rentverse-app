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

  /**
   * Finds a tenancy agreement by its ID.
   * @param agreementId The ID of the agreement.
   * @returns The found agreement or null if not found.
   */
  async findAgreementById(agreementId: number) {
    return prisma.tenancyAgreement.findUnique({
      where: { id: agreementId },
      include: {
        property: {
          select: {
            title: true,
            listedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Finds all agreements for a given user, either as an owner or a tenant.
   * @param userId The ID of the user.
   * @returns A list of agreements.
   */
  async findAgreementsForUser(userId: number) {
    return prisma.tenancyAgreement.findMany({
      where: {
        OR: [{ ownerId: userId }, { tenantId: userId }],
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            // Corrected query to get the primary image from the PropertyImage model
            images: {
              take: 1,
              orderBy: {
                displayOrder: "asc",
              },
              select: {
                imageUrl: true,
              },
            },
            listedBy: { select: { fullName: true } },
          },
        },
        tenant: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Finds a tenancy agreement by its DocuSign envelope ID.
   * @param docusignEnvelopeId The DocuSign envelope ID.
   * @returns The found agreement or null if not found.
   */
  async findAgreementByDocusignId(docusignEnvelopeId: string) {
    return prisma.tenancyAgreement.findUnique({
      where: { docusignEnvelopeId },
    });
  }

  /**
   * Updates the status of a tenancy agreement.
   * @param agreementId The ID of the agreement to update.
   * @param status The new status to set.
   * @returns The updated agreement.
   */
  async updateAgreementStatus(agreementId: number, status: TenancyStatus) {
    return prisma.tenancyAgreement.update({
      where: { id: agreementId },
      data: { status },
    });
  }
}
