// File Path: apps/core-service/src/api/webhooks/webhooks.service.ts

import { AgreementRepository } from "../agreements/agreements.repository.js";
// Corrected import: TenancyStatus is part of the Prisma namespace.
import { Prisma, TenancyStatus } from "@prisma/client";

export class WebhookService {
  private agreementRepository: AgreementRepository;

  constructor(agreementRepository: AgreementRepository) {
    this.agreementRepository = agreementRepository;
  }

  /**
   * Handles a DocuSign webhook notification.
   * In a real application, this would also verify the webhook signature.
   * @param payload The raw webhook payload from DocuSign.
   */
  async handleDocusignWebhook(payload: any) {
    // Assuming the payload has an event type and an envelope ID
    const { envelopeId, event } = payload;

    if (!envelopeId || !event) {
      console.error("Invalid DocuSign webhook payload:", payload);
      return;
    }

    if (event === "envelope-completed") {
      // Find the agreement by its Docusign envelope ID and update the status
      const agreement =
        await this.agreementRepository.findAgreementByDocusignId(envelopeId);
      if (agreement) {
        // Correctly reference the enum from the Prisma namespace
        await this.agreementRepository.updateAgreementStatus(
          agreement.id,
          TenancyStatus.ACTIVE
        );
        console.log(
          `Agreement ${agreement.id} status updated to ACTIVE from DocuSign webhook.`
        );
      } else {
        console.warn(
          `DocuSign webhook received for unknown envelope ID: ${envelopeId}`
        );
      }
    }
  }
}
