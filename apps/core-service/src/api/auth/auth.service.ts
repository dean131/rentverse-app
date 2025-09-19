// File Path: apps/core-service/src/api/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { AuthRepository } from "./auth.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { config } from "../../config/index.js";

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  private generateAccessToken(user: User): string {
    const payload = { userId: user.id, role: user.role };
    // CORRECTED: Explicitly cast the options to jwt.SignOptions to resolve overload ambiguity.
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiration,
    } as jwt.SignOptions);
  }

  private generateRefreshToken(user: User): string {
    const payload = { userId: user.id };
    // CORRECTED: Explicitly cast the options to jwt.SignOptions.
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiration,
    } as jwt.SignOptions);
  }

  // ... (rest of the service is unchanged)
  async register(userData: any) {
    const { email, password, fullName, role } = userData;
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.authRepository.createUser({
      email,
      password: hashedPassword,
      fullName,
      role,
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(credentials: any) {
    const { email, password } = credentials;
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await this.authRepository.saveRefreshToken(user.id, refreshToken);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(token: string) {
    const refreshTokenData = await this.authRepository.findRefreshToken(token);
    if (!refreshTokenData) {
      throw new ApiError(401, "Invalid refresh token");
    }
    try {
      jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
      throw new ApiError(403, "Refresh token has expired or is invalid");
    }
    const newAccessToken = this.generateAccessToken(refreshTokenData.user);
    const { password: _, ...userWithoutPassword } = refreshTokenData.user;
    return { user: userWithoutPassword, accessToken: newAccessToken };
  }

  async logout(userId: number) {
    await this.authRepository.deleteRefreshToken(userId);
  }
}
