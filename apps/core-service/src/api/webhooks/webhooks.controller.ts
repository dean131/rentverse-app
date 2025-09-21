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
    // DocuSign sends the signature in a header (headers are case-insensitive)
    const signature = req.header("x-docusign-signature-1");
    if (!signature) {
      throw new ApiError(400, "Missing DocuSign signature header.");
    }

    // We use the raw body buffer for HMAC verification. This is enabled by a special
    // middleware in our main app.ts file.
    const rawPayload = (req as any).rawBody;
    if (!rawPayload) {
      throw new ApiError(
        400,
        "Raw request body is not available for signature verification."
      );
    }

    await this.webhookService.processDocusignEvent(
      req.body,
      signature,
      rawPayload
    );

    // Acknowledge receipt of the webhook to DocuSign with a 204 No Content response.
    res.status(204).send();
  });
}
