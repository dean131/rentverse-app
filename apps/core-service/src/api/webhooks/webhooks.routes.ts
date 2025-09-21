// File Path: apps/core-service/src/api/webhooks/webhooks.routes.ts
import { Router } from "express";
import { WebhookController } from "./webhooks.controller.js";

export const createWebhookRouter = (controller: WebhookController): Router => {
  const router = Router();

  // This is a public endpoint that DocuSign's servers will call.
  // It is not protected by our JWT middleware; it is secured by the HMAC signature instead.
  router.post("/docusign", controller.handleDocusignWebhook);

  return router;
};
