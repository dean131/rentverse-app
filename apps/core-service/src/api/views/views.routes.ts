// File Path: apps/core-service/src/api/views/views.routes.ts
import { Router } from "express";
import { ViewController } from "./views.controller.js";

export const createViewRouter = (controller: ViewController): Router => {
  const router = Router();
  router.get("/", controller.getAllViews);
  return router;
};
