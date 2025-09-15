import request from "supertest";
import app from "../src/app.js"; // Import our configured Express app
import { prisma } from "../src/lib/prisma.js"; // Import prisma to manage the connection

// Test suite for the Health Check endpoint
describe("GET /api/health", () => {
  // After all tests in this file are done, disconnect from the database
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Test case to ensure the endpoint is alive and responds correctly
  it("should respond with a 200 OK status and the correct service message", async () => {
    // Arrange & Act: Use Supertest to make a GET request to our app
    const response = await request(app).get("/api/health");

    // Assert: Use Jest's expect to check the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "Core Service",
    });
  });

  // Test case to check for the correct headers
  it("should respond with a Content-Type of application/json", async () => {
    // Supertest allows chaining assertions for a more concise test
    await request(app)
      .get("/api/health")
      .expect(200) // Supertest assertion for status code
      .expect("Content-Type", /json/); // Supertest assertion for header
  });
});
