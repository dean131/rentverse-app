// File Path: apps/core-service/src/api/webhooks/webhooks.controller.ts

import { Request, Response, NextFunction } from "express";
import { WebhookService } from "./webhooks.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export class WebhookController {
  private webhookService: WebhookService;

  constructor(webhookService: WebhookService) {
    this.webhookService = webhookService;
  }

  /**
   * Handles incoming webhooks from DocuSign.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  handleDocusignWebhook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // In a real application, you would first verify the webhook signature.
      // The raw body is already attached to req.rawBody by middleware in app.ts.
      // const isSignatureValid = verifyDocusignWebhookSignature(req.rawBody, req.headers["x-docusign-signature"]);
      // if (!isSignatureValid) {
      //   res.status(403).send("Invalid signature");
      //   return;
      // }

      await this.webhookService.handleDocusignWebhook(req.body);
      res.status(200).send("Webhook received");
    }
  );
}
