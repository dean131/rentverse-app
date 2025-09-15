// File Path: apps/core-service/src/api/auth/auth.service.test.ts
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

// Mock all external dependencies to isolate the service
jest.mock("./auth.repository.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// A sample user object to be used across tests
const testUser: User = {
  id: 1,
  fullName: "Test User",
  email: "test.user@example.com",
  password: "hashedPassword123",
  role: "PROPERTY_OWNER",
  phone: null,
  country: null,
  profilePictureUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("AuthService", () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    // Reset all mocks before each test to ensure isolation
    jest.clearAllMocks();

    // Create new instances of the mock repository and the service
    mockAuthRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    authService = new AuthService(mockAuthRepository);
  });

  // --- Test Suite for registerUser ---
  describe("registerUser", () => {
    it("should hash the password and create a new user successfully", async () => {
      // Arrange: Setup mock implementations
      const inputData = {
        fullName: "Test User",
        email: "test.user@example.com",
        password: "rawPassword123",
        role: "PROPERTY_OWNER",
      };
      const hashedPassword = "hashedPassword123";

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.createUser.mockResolvedValue(testUser);

      // Act: Call the method being tested
      const result = await authService.registerUser(inputData);

      // Assert: Verify the results
      expect(bcrypt.hash).toHaveBeenCalledWith(inputData.password, 10);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith({
        ...inputData,
        password: hashedPassword, // Ensure the hashed password was used
      });
      expect(result).toEqual(testUser);
    });
  });

  // --- Test Suite for loginUser ---
  describe("loginUser", () => {
    it("should return access and refresh tokens for valid credentials", async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake-access-token");
      mockAuthRepository.createRefreshToken.mockResolvedValue({} as any);

      // Act
      const result = await authService.loginUser(
        testUser.email,
        "ValidPassword123"
      );

      // Assert
      expect(result).toHaveProperty("accessToken", "fake-access-token");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.refreshToken).toBe("string");
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
        testUser.email
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "ValidPassword123",
        testUser.password
      );
      expect(mockAuthRepository.createRefreshToken).toHaveBeenCalled();
    });

    it("should throw a 401 ApiError for an incorrect password", async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password does not match

      // Act & Assert
      await expect(
        authService.loginUser(testUser.email, "WrongPassword")
      ).rejects.toThrow(new ApiError(401, "Invalid credentials."));
    });

    it("should throw a 401 ApiError for a non-existent email", async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(null); // User not found

      // Act & Assert
      await expect(
        authService.loginUser("nonexistent@example.com", "anyPassword")
      ).rejects.toThrow(new ApiError(401, "Invalid credentials."));
    });
  });
});
