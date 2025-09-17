// File Path: apps/core-service/src/api/admin/admin.service.ts
import { Property, PropertyStatus } from "@prisma/client";
import { AdminRepository } from "./admin.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getPendingProperties(): Promise<Property[]> {
    return this.adminRepository.findPendingProperties();
  }

  async updatePropertyStatus(id: number, status: string): Promise<Property> {
    // Ensure the status is a valid PropertyStatus enum value before updating
    if (status !== "APPROVED" && status !== "REJECTED") {
      throw new ApiError(400, "Invalid status provided.");
    }
    return this.adminRepository.updatePropertyStatus(
      id,
      status as PropertyStatus
    );
  }
}
