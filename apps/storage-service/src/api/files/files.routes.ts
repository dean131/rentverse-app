import { Router } from "express";
import { generatePresignedUrl } from "./files.controller.js";

const router = Router();

router.post("/upload-url", generatePresignedUrl);

export default router;
