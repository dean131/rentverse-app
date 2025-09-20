// File Path: apps/core-service/src/api/webhooks/webhooks.routes.ts
import { Router } from "express";
import { WebhookController } from "./webhooks.controller.js";

export const createWebhookRouter = (controller: WebhookController): Router => {
  const router = Router();

  // This is a public endpoint that DocuSign's servers will call.
  // It does not use our standard JWT protection; it's secured by the HMAC signature.
  router.post("/docusign", controller.handleDocusignWebhook);

  return router;
};
