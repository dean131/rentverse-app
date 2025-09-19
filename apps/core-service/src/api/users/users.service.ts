// File Path: apps/core-service/src/api/users/users.service.ts
import { AdminRepository } from "../admin/admin.repository.js";
import { UserRepository } from "./users.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js"; // Import PropertyRepository
import { ApiError } from "../../utils/ApiError.js";
import { AuthenticatedUser } from "../../middleware/auth.middleware.js";

export class UserService {
  private userRepository: UserRepository;
  private propertyRepository: PropertyRepository; // Add property repository
  private adminRepository: AdminRepository;

  constructor(
    userRepository: UserRepository,
    propertyRepository: PropertyRepository, // Add property repository to constructor
    adminRepository: AdminRepository
  ) {
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository; // Assign it
    this.adminRepository = adminRepository;
  }

  async getUserDashboard(user: AuthenticatedUser) {
    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }

    switch (user.role) {
      case "ADMIN":
        return this.adminRepository.getAdminDashboardStats();

      case "PROPERTY_OWNER":
        // CORRECTED: Use the propertyRepository to get property stats
        return this.propertyRepository.getUserPropertyStats(user.id);

      case "TENANT":
        return {
          welcomeMessage: "Welcome to your dashboard!",
          savedProperties: 0,
        };

      default:
        throw new ApiError(400, "Invalid user role");
    }
  }
}
