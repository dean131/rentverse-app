// File Path: apps/core-service/src/api/users/users.service.ts

import { UserRepository } from "./users.repository.js";
import { PropertyRepository } from "../properties/properties.repository.js";
import { AdminRepository } from "../admin/admin.repository.js";
import { Prisma, Role } from "@prisma/client";
import { ApiError } from "../../utils/ApiError.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

export class UserService {
  private userRepository: UserRepository;
  private propertyRepository: PropertyRepository;
  private adminRepository: AdminRepository;

  constructor(
    userRepository: UserRepository,
    propertyRepository: PropertyRepository,
    adminRepository: AdminRepository
  ) {
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
    this.adminRepository = adminRepository;
  }

  async getCurrentUser(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  async updateProfile(id: number, data: Prisma.UserUpdateInput) {
    return this.userRepository.updateUser(id, data);
  }
}
