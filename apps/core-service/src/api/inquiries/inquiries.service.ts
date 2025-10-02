// Create a new file at: core-service/src/api/inquiries/inquiries.service.ts

import { PropertyRepository } from "../properties/properties.repository.js";
import { emailService } from "../../services/email.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { config } from "../../config/index.js";

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
    const html = `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>You've received a new inquiry!</h2>
        <p>A potential buyer/tenant is interested in your property listed on Rentverse.</p>
        <hr>
        <h3>Property Details:</h3>
        <p><strong>Title:</strong> <a href="${propertyUrl}">${property.title}</a></p>
        <p><strong>Address:</strong> ${property.address}</p>
        <hr>
        <h3>Inquirer's Information:</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <h3>Message:</h3>
        <p style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9;">
          ${data.message}
        </p>
        <hr>
        <p>Please respond to them at your earliest convenience.</p>
        <p>- The Rentverse Team</p>
      </div>
    `;

    await emailService.sendMail({
      to: owner.email,
      subject,
      html,
    });
  }
}
