// File Path: apps/core-service/src/api/users/users.service.ts
import { Role } from "@prisma/client";
import { UserRepository } from "./users.repository.js";
import { AdminRepository } from "../admin/admin.repository.js"; // Import AdminRepository
import { ApiError } from "../../utils/ApiError.js";

export class UserService {
  private userRepository: UserRepository;
  private adminRepository: AdminRepository; // Add AdminRepository

  // Inject both repositories
  constructor(
    userRepository: UserRepository,
    adminRepository: AdminRepository
  ) {
    this.userRepository = userRepository;
    this.adminRepository = adminRepository;
  }

  /**
   * Fetches dashboard data tailored to the user's role.
   * @param userId - The ID of the authenticated user.
   * @param role - The role of the authenticated user.
   * @returns Dashboard summary data.
   */
  async getDashboardData(userId: number, role: Role) {
    switch (role) {
      case Role.PROPERTY_OWNER:
        // For a property owner, get counts of their own properties.
        return this.userRepository.countPropertiesByStatusForUser(userId);

      case Role.ADMIN:
        // For an admin, get system-wide counts.
        return this.adminRepository.getAdminDashboardStats();

      case Role.TENANT:
        // For a tenant, we can return other relevant data in the future.
        // For now, we'll return a simple object.
        return {
          favoritesCount: 0, // Placeholder
          reviewsCount: 0, // Placeholder
        };

      default:
        // Handle unexpected roles gracefully.
        throw new ApiError(403, "Dashboard data not available for this role.");
    }
  }
}
