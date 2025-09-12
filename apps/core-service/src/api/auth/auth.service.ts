import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "@prisma/client";
import { AuthRepository } from "./auth.repository.js";

// Define token expiration times
const ACCESS_TOKEN_EXPIPIRES_IN = "15m"; // Short-lived
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7; // Long-lived

export class AuthService {
  private authRepository: AuthRepository;
  private jwtSecret: string;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
    this.jwtSecret = process.env.JWT_SECRET || "DEFAULT_SECRET";
    if (this.jwtSecret === "DEFAULT_SECRET") {
      console.warn("Warning: JWT_SECRET is not set in environment variables.");
    }
  }

  private generateAccessToken(user: User): string {
    return jwt.sign({ userId: user.id, role: user.role }, this.jwtSecret, {
      expiresIn: ACCESS_TOKEN_EXPIPIRES_IN,
    });
  }

  async registerUser(userData: any): Promise<User> {
    const { fullName, email, password, role } = userData;
    if (!fullName || !email || !password || !role) {
      throw new Error("Missing required fields");
    }

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
    const user = await this.authRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new Error("Invalid credentials.");
    }

    const accessToken = this.generateAccessToken(user);

    // Generate a secure, random refresh token
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
      throw new Error("Refresh token not provided.");
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const storedToken =
      await this.authRepository.findRefreshToken(hashedRefreshToken);

    if (!storedToken || new Date() > storedToken.expiresAt) {
      throw new Error("Invalid or expired refresh token.");
    }

    // FIXED: Use the repository to find the user, not prisma directly.
    const user = await this.authRepository.findUserById(storedToken.userId);
    if (!user) {
      throw new Error("User not found for this token.");
    }

    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async logoutUser(token: string): Promise<void> {
    if (!token) {
      return; // No token, nothing to do
    }
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    await this.authRepository
      .deleteRefreshToken(hashedRefreshToken)
      .catch(() => {}); // Ignore errors if token doesn't exist
  }
}
