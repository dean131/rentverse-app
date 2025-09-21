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
   * @param payload The raw request body buffer.
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

    console.log(
      `DocuSign Webhook: Received event '${event}' for envelope ${envelopeId}.`
    );

    // 2. Check if the event is the one we care about: when the envelope is fully signed
    if (event === "envelope_completed") {
      console.log(
        `-> Envelope ${envelopeId} has been completed by all parties.`
      );

      // 3. Update the agreement status in our database to ACTIVE
      await this.agreementRepository.updateStatusByEnvelopeId(
        envelopeId,
        TenancyStatus.ACTIVE
      );

      // In a real application, you would also trigger notifications (e.g., email)
      // to inform the users that the contract is now active.
      console.log(
        `-> Database updated: Agreement for envelope ${envelopeId} is now ACTIVE.`
      );
    } else {
      console.log(`-> Ignoring unhandled event type.`);
    }
  }
}
