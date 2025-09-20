// File Path: apps/core-service/src/api/webhooks/webhooks.controller.ts
import { Request, Response } from "express";
import { WebhookService } from "./webhooks.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

export class WebhookController {
  private webhookService: WebhookService;

  constructor(webhookService: WebhookService) {
    this.webhookService = webhookService;
  }

  handleDocusignWebhook = asyncHandler(async (req: Request, res: Response) => {
    // The signature is passed in a header by DocuSign
    const signature = req.header("x-docusign-signature-1"); // Headers are case-insensitive
    if (!signature) {
      throw new ApiError(400, "Missing DocuSign signature header.");
    }

    // We use the raw body buffer for HMAC verification, so we need a special middleware for this route.
    const rawPayload = (req as any).rawBody;
    if (!rawPayload) {
      throw new ApiError(
        400,
        "Raw request body not available for signature verification."
      );
    }

    await this.webhookService.processDocusignEvent(
      req.body,
      signature,
      rawPayload
    );

    // Acknowledge receipt of the webhook to DocuSign
    res.status(204).send();
  });
}
