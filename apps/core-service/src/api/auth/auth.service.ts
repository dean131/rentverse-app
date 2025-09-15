import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "@prisma/client";
import { AuthRepository } from "./auth.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { config } from "../../config/index.js";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  private generateAccessToken(user: User): string {
    return jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  async registerUser(userData: any): Promise<User> {
    const { fullName, email, password, role } = userData;
    // The initial check for missing fields is now removed, as Zod handles it.

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return this.authRepository.createUser({
      fullName,
      email,
      password: hashedPassword,
      role,
    });
  }

  async loginUser(
    email: string,
    pass: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // The check for missing email/pass is removed, as Zod handles it.
    const user = await this.authRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new ApiError(401, "Invalid credentials.");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

    await this.authRepository.createRefreshToken({
      userId: user.id,
      token: hashedRefreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      throw new ApiError(401, "Refresh token not provided.");
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const storedToken =
      await this.authRepository.findRefreshToken(hashedRefreshToken);

    if (!storedToken || new Date() > storedToken.expiresAt) {
      throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const user = await this.authRepository.findUserById(storedToken.userId);
    if (!user) {
      throw new ApiError(401, "User for this token not found.");
    }

    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async logoutUser(token: string): Promise<void> {
    if (!token) {
      return;
    }
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    await this.authRepository
      .deleteRefreshToken(hashedRefreshToken)
      .catch(() => {});
  }
}
