// File Path: apps/core-service/src/api/webhooks/webhooks.routes.ts
import { Router } from "express";
import { WebhookController } from "./webhooks.controller.js";

export const createWebhookRouter = (controller: WebhookController): Router => {
  const router = Router();
  router.post("/docusign", controller.handleDocusignWebhook);
  return router;
};
