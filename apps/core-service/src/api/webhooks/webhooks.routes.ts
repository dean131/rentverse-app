// File Path: apps/core-service/src/api/webhooks/webhooks.routes.ts

import { Router } from "express";
import { WebhookController } from "./webhooks.controller.js";

/**
 * Creates and returns the Express router for the webhooks module.
 * @param controller The WebhookController instance.
 * @returns The configured Express router.
 */
export function createWebhookRouter(controller: WebhookController): Router {
  const router = Router();

  // DocuSign webhook endpoint. This endpoint does not require authentication.
  router.post("/docusign", controller.handleDocusignWebhook);

  return router;
}
