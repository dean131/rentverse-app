// File Path: apps/core-service/src/api/webhooks/webhooks.service.ts
import crypto from "crypto";
import { config } from "../../config/index.js";
import { AgreementRepository } from "../agreements/agreements.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { TenancyStatus } from "@prisma/client";

export class WebhookService {
  private agreementRepository: AgreementRepository;

  constructor(agreementRepository: AgreementRepository) {
    this.agreementRepository = agreementRepository;
  }

  /**
   * Verifies the HMAC signature from DocuSign to ensure the request is authentic.
   * @param signature The signature from the 'X-DocuSign-Signature-1' header.
   * @param payload The raw request body.
   * @returns {boolean} True if the signature is valid.
   */
  private verifySignature(signature: string, payload: Buffer): boolean {
    const hmac = crypto.createHmac("sha256", config.docusign.webhookSecret);
    hmac.update(payload);
    const computedSignature = hmac.digest("base64");

    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  }

  /**
   * Processes incoming events from the DocuSign webhook.
   */
  async processDocusignEvent(
    payload: any,
    signature: string,
    rawPayload: Buffer
  ) {
    // 1. Security First: Verify the webhook signature
    if (!this.verifySignature(signature, rawPayload)) {
      console.warn("Invalid DocuSign webhook signature received.");
      throw new ApiError(401, "Invalid webhook signature.");
    }

    const event = payload.event;
    const envelopeId = payload.data.envelopeId;

    // 2. Check if the event is the one we care about: 'envelope-completed'
    if (event === "envelope_completed") {
      console.log(
        `DocuSign Webhook: Envelope ${envelopeId} has been completed by all parties.`
      );

      // 3. Update the agreement status in our database
      await this.agreementRepository.updateStatusByEnvelopeId(
        envelopeId,
        TenancyStatus.ACTIVE
      );

      // In a real app, you would also trigger notifications (email, etc.) to the users here.
      console.log(
        `Database updated: Agreement for envelope ${envelopeId} is now ACTIVE.`
      );
    } else {
      console.log(
        `DocuSign Webhook: Received unhandled event '${event}' for envelope ${envelopeId}. Ignoring.`
      );
    }
  }
}
