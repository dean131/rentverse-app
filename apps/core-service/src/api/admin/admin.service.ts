// File Path: apps/core-service/src/api/admin/admin.service.ts
import { Property, PropertyStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError.js";
import { AdminRepository } from "./admin.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js";

export class AdminService {
  private adminRepository: AdminRepository;
  private propertyRepository: PropertyRepository;

  constructor(
    adminRepository: AdminRepository,
    propertyRepository: PropertyRepository
  ) {
    this.adminRepository = adminRepository;
    this.propertyRepository = propertyRepository;
  }

  async findPendingProperties(): Promise<any[]> {
    return this.adminRepository.findPendingProperties();
  }

  async updatePropertyStatus(
    id: number,
    status: PropertyStatus
  ): Promise<Property> {
    console.log("===LOGGER===");
    console.log(id);
    const property = await this.propertyRepository.findPropertyById(id);
    console.log(property);
    if (!property) {
      throw new ApiError(404, "Property not found");
    }
    return this.adminRepository.updatePropertyStatus(id, status);
  }

  async getDashboardStats() {
    return this.adminRepository.getAdminDashboardStats();
  }

  async getUsers(page: number) {
    return this.adminRepository.findAllUsers(page);
  }
}
