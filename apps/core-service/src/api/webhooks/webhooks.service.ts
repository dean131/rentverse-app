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
    if (!this.verifySignature(signature, rawPayload)) {
      console.warn("Invalid DocuSign webhook signature received.");
      throw new ApiError(401, "Invalid webhook signature.");
    }

    const event = payload.event;
    const envelopeId = payload.data.envelopeId;

    console.log(
      `DocuSign Webhook: Received event '${event}' for envelope ${envelopeId}.`
    );

    if (event === "envelope-completed") {
      console.log(
        `-> Envelope ${envelopeId} has been completed by all parties.`
      );
      await this.agreementRepository.updateStatusByEnvelopeId(
        envelopeId,
        TenancyStatus.ACTIVE
      );
      console.log(
        `-> Database updated: Agreement for envelope ${envelopeId} is now ACTIVE.`
      );
    } else {
      console.log(`-> Ignoring unhandled event type.`);
    }
  }
}
