// File Path: apps/core-service/src/api/auth/auth.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Prisma, User } from "@prisma/client";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async saveRefreshToken(userId: number, token: string): Promise<void> {
    // Refresh tokens should have an expiry date. Let's set it for 7 days.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Upsert ensures we create a new token or update the existing one for the user
    await prisma.refreshToken.upsert({
      // The 'where' clause must use a field that is unique in your schema.
      where: { userId },
      update: { token, expiresAt },
      // The 'create' clause must include all required fields from your schema.
      create: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
