// Create a new file at: core-service/src/api/inquiries/inquiries.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { InquiryService } from "./inquiries.service.js";

export class InquiryController {
  private inquiryService: InquiryService;

  constructor(inquiryService: InquiryService) {
    this.inquiryService = inquiryService;
  }

  submitInquiry = asyncHandler(async (req: Request, res: Response) => {
    await this.inquiryService.processInquiry(req.body);
    ApiResponse.success(res, { message: "Inquiry sent successfully." });
  });
}
