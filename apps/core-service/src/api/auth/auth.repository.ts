import { prisma } from '../../lib/prisma.js';
import { Prisma, User } from '@prisma/client';

// This class encapsulates all database access logic for the User model.
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
}