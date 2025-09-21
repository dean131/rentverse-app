// File Path: apps/core-service/src/api/users/users.repository.ts

import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

export class UserRepository {
  /**
   * Creates a new user in the database.
   * @param data The user data.
   * @returns The newly created user.
   */
  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  /**
   * Finds a user by their email address.
   * @param email The user's email.
   * @returns The found user or null if not found.
   */
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Finds a user by their unique ID.
   * @param id The user's ID.
   * @returns The found user or null if not found.
   */
  async findUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * Updates a user's profile information.
   * @param id The ID of the user to update.
   * @param data The fields to update.
   * @returns The updated user.
   */
  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
