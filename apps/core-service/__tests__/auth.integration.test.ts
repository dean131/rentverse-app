// File Path: apps/core-service/__tests__/auth.integration.test.ts
import request from "supertest";
import app from "../src/app.js"; // Import our configured Express app
import { prisma } from "../src/lib/prisma.js"; // Import prisma to manage test data

// A helper function to clean the database, respecting relationships
const cleanDb = async () => {
  // Delete records in the correct order to avoid foreign key constraint errors
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
};

// Test suite for the entire Authentication module
describe("Authentication API Endpoints", () => {
  // Before all tests in this suite, clear the database to ensure a clean state
  beforeAll(async () => {
    await cleanDb();
  });

  // After each individual test, clear the database again to prevent tests from interfering with each other
  afterEach(async () => {
    await cleanDb();
  });

  // After all tests in this suite are complete, disconnect from the database
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Test Suite for the /register endpoint ---
  describe("POST /api/auth/register", () => {
    const validUserData = {
      fullName: "Test User",
      email: "test@example.com",
      password: "Password123",
      role: "PROPERTY_OWNER",
    };

    it("should register a new user successfully with valid data", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(validUserData.email);
      expect(response.body.data).not.toHaveProperty("password"); // Ensure password is not returned

      // Verify that the user was actually created in the database
      const userInDb = await prisma.user.findUnique({
        where: { email: validUserData.email },
      });
      expect(userInDb).not.toBeNull();
    });

    it("should return a 409 Conflict error if the email already exists", async () => {
      // First, create the user
      await request(app).post("/api/auth/register").send(validUserData);

      // Then, try to create the same user again
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "A record with this identifier already exists."
      );
    });

    it("should return a 400 Bad Request for invalid data (e.g., short password)", async () => {
      const invalidUserData = { ...validUserData, password: "123" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUserData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors[0].field).toBe("password");
      expect(response.body.errors[0].message).toBe(
        "Password must be at least 8 characters long"
      );
    });
  });

  // --- Test Suite for the /login endpoint ---
  describe("POST /api/auth/login", () => {
    const validUserData = {
      fullName: "Login Test User",
      email: "login.test@example.com",
      password: "Password123",
      role: "TENANT",
    };

    // Before each login test, ensure the user exists in the database
    beforeEach(async () => {
      // We use the register endpoint to set up the user for the login test
      await request(app).post("/api/auth/register").send(validUserData);
    });

    it("should log in a user successfully and return an accessToken and a refreshToken cookie", async () => {
      const loginCredentials = {
        email: validUserData.email,
        password: validUserData.password,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(typeof response.body.data.accessToken).toBe("string");
      // Check that the Set-Cookie header is present and contains the refreshToken
      expect(response.headers["set-cookie"][0]).toContain("refreshToken=");
      expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
    });

    it("should return a 401 Unauthorized error for an incorrect password", async () => {
      const loginCredentials = {
        email: validUserData.email,
        password: "WrongPassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials.");
    });
  });
});
