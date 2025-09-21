// File Path: apps/core-service/src/api/webhooks/webhooks.controller.ts

import { Request, Response, NextFunction } from "express";
import { WebhookService } from "./webhooks.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class WebhookController {
  private webhookService: WebhookService;

  constructor(webhookService: WebhookService) {
    this.webhookService = webhookService;
  }

  handleDocusignWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.header("x-docusign-signature-1");
    if (!signature) {
      throw new ApiError(400, "Missing DocuSign signature header.");
    }

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

    res.status(204).send();
  });
}
