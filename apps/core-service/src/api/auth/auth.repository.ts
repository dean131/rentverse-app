import { prisma } from "../../lib/prisma.js";
import { Prisma, User, RefreshToken } from "@prisma/client";

export class AuthRepository {
  // --- User Methods ---
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  // NEW method to find a user by their ID
  async findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  // --- Refresh Token Methods ---
  async createRefreshToken(data: {
    userId: number;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }
}
