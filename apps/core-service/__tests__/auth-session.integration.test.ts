// File Path: apps/core-service/__tests__/auth-session.integration.test.ts
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { cleanDb } from "./setup.js";

describe("Authentication Session API Endpoints", () => {
  // Use the centralized cleanup function
  beforeAll(cleanDb);
  afterEach(cleanDb);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Test Suite for /refresh and /logout ---
  describe("Session Management", () => {
    // FIXED: Changed type from string[] to any to handle type inconsistencies from supertest
    let refreshTokenCookie: any;

    // Before each test in this suite, register and log in a user to establish a session
    beforeEach(async () => {
      const userData = {
        fullName: "Session User",
        email: "session.user@example.com",
        password: "Password123",
        role: "TENANT",
      };
      await request(app).post("/api/auth/register").send(userData);

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      // Capture the Set-Cookie header from the login response
      refreshTokenCookie = loginResponse.headers["set-cookie"];
    });

    it("POST /refresh should issue a new access token when a valid refresh token cookie is provided", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshTokenCookie) // Send the captured cookie
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(typeof response.body.data.accessToken).toBe("string");
    });

    it("POST /refresh should return a 401 error if no refresh token cookie is provided", async () => {
      const response = await request(app).post("/api/auth/refresh").send(); // Send no cookie

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Refresh token not provided.");
    });

    it("POST /logout should clear the refresh token cookie and invalidate the token", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", refreshTokenCookie) // Send the cookie to be invalidated
        .send();

      expect(response.status).toBe(204); // Expect a No Content response

      // Verify the cookie is cleared
      expect(response.headers["set-cookie"][0]).toContain("refreshToken=;");
      // FIXED: Check for the 'Expires' attribute, which is Express's default way to clear a cookie.
      expect(response.headers["set-cookie"][0]).toContain(
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );

      // Verify that trying to refresh with the same (now invalid) cookie fails
      const refreshResponse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", refreshTokenCookie)
        .send();

      expect(refreshResponse.status).toBe(401);
    });
  });
});
