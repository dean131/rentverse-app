// File Path: apps/core-service/__tests__/properties.integration.test.ts
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { User } from "@prisma/client";
import { cleanDb } from "./setup.js"; // Import the centralized cleanup function

describe("Properties API Endpoints", () => {
  let testUser: User;
  let accessToken: string;

  // Before all tests, set up a clean database and a logged-in user with master data
  beforeAll(async () => {
    await cleanDb();

    // 1. Register a user via the API to get a real hashed password
    const registerRes = await request(app).post("/api/auth/register").send({
      fullName: "Property Owner Test",
      email: "owner.test@example.com",
      password: "Password123",
      role: "PROPERTY_OWNER",
    });
    testUser = registerRes.body.data; // Save the created user data

    // 2. Log in that user to get a valid access token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "owner.test@example.com",
      password: "Password123",
    });
    accessToken = loginRes.body.data.accessToken;

    // 3. Seed necessary master data (Projects and Views) for the tests
    await prisma.project.create({
      data: { id: 1, projectName: "Test Project", address: "123 Test St" },
    });
    await prisma.view.createMany({
      data: [
        { id: 1, name: "City View" },
        { id: 3, name: "Garden View" },
      ],
    });
  });

  // After all tests in this suite are complete, clean up and disconnect
  afterAll(async () => {
    await cleanDb();
    await prisma.$disconnect();
  });

  describe("POST /api/properties", () => {
    // A valid payload for creating a new property
    const validPropertyData = {
      title: "Beautiful Modern Apartment",
      description: "A stunning apartment with great views.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      rentalPrice: 5000000,
      paymentPeriod: "MONTHLY",
      sizeSqft: 850,
      bedrooms: 2,
      bathrooms: 1,
      furnishingStatus: "FULLY_FURNISHED",
      latitude: -6.2,
      longitude: 106.8,
      projectId: 1,
      ownershipDocumentUrl: "https://example.com/docs/proof.pdf",
      viewIds: [1, 3],
    };

    it("should create a new property successfully with valid data and authentication", async () => {
      const response = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${accessToken}`) // Use the token
        .send(validPropertyData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(validPropertyData.title);
      expect(response.body.data.status).toBe("PENDING");
      expect(response.body.data.listedById).toBe(testUser.id);

      // Verify that related records were created in the database
      const doc = await prisma.propertyDocument.findFirst({
        where: { propertyId: response.body.data.id },
      });
      expect(doc).not.toBeNull();
      const view = await prisma.propertyView.findFirst({
        where: { propertyId: response.body.data.id },
      });
      expect(view).not.toBeNull();
    });

    it("should return a 401 Unauthorized error if no access token is provided", async () => {
      const response = await request(app)
        .post("/api/properties")
        .send(validPropertyData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Not authorized, no token provided");
    });

    it("should return a 400 Bad Request error for invalid data (e.g., missing title)", async () => {
      const invalidData = { ...validPropertyData, title: "" }; // Make the title invalid

      const response = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });
  });
});
