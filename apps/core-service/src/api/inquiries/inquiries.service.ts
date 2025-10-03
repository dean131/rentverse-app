// File Path: core-service/src/api/inquiries/inquiries.service.ts

import { PropertyRepository } from "../properties/properties.repository.js";
import { emailService } from "../../services/email.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { config } from "../../config/index.js";
import { createInquiryEmailTemplate } from "../../templates/inquiry.template.js"; // <-- Import the new template

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: number;
}

export class InquiryService {
  private propertyRepository: PropertyRepository;

  constructor(propertyRepository: PropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  public async processInquiry(data: InquiryData): Promise<void> {
    const property = await this.propertyRepository.findPropertyById(
      data.propertyId
    );

    if (!property || !property.listedBy) {
      throw new ApiError(404, "Property or property owner not found.");
    }

    const owner = property.listedBy;
    const propertyUrl = `${config.frontendUrl}/properties/${property.id}`;

    const subject = `New Inquiry for your property: "${property.title}"`;

    // Use the new template function to generate the email body
    const html = createInquiryEmailTemplate({
      propertyName: property.title,
      propertyUrl: propertyUrl,
      inquirerName: data.name,
      inquirerEmail: data.email,
      inquirerPhone: data.phone,
      message: data.message,
    });

    await emailService.sendMail({
      to: owner.email,
      subject,
      html,
    });
  }
}
