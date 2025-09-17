// File Path: apps/core-service/prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Clean up existing data to ensure a fresh start
  console.log("Cleaning database...");
  await prisma.favorite.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.propertyAmenity.deleteMany({});
  await prisma.propertyView.deleteMany({});
  await prisma.propertyDocument.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.rentalAgreement.deleteMany({});
  await prisma.nearbyFacility.deleteMany({});
  await prisma.propertyImage.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.view.deleteMany({});
  await prisma.facilityCategory.deleteMany({});
  console.log("Database cleaned.");

  // 2. Create Users with hashed passwords
  console.log("Creating users...");
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash("admin123", saltRounds);
  const ownerPassword = await bcrypt.hash("owner123", saltRounds);
  const tenantPassword = await bcrypt.hash("tenant123", saltRounds);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Rentverse",
      email: "admin@rentverse.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const propertyOwner = await prisma.user.create({
    data: {
      fullName: "Budi Property",
      email: "owner@rentverse.com",
      password: ownerPassword,
      role: Role.PROPERTY_OWNER,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      fullName: "Citra Lestari",
      email: "tenant@rentverse.com",
      password: tenantPassword,
      role: Role.TENANT,
    },
  });
  console.log("Users created:", { admin, propertyOwner, tenant });

  // 3. Create Master Data
  console.log("Creating master data...");
  const project1 = await prisma.project.create({
    data: {
      projectName: "Margonda Residence V",
      developer: "Cempaka Group",
      address: "Jl. Margonda Raya, Depok",
    },
  });
  const project2 = await prisma.project.create({
    data: {
      projectName: "Mataram City Apartment",
      developer: "Saraswanti Group",
      address: "Jl. Palagan Tentara Pelajar, Yogyakarta",
    },
  });

  const amenities = await prisma.amenity.createManyAndReturn({
    data: [
      { name: "Swimming Pool" },
      { name: "Gymnasium" },
      { name: "Covered Parking" },
      { name: "24/7 Security" },
      { name: "Jogging Track" },
    ],
  });

  const views = await prisma.view.createManyAndReturn({
    data: [
      { name: "City View" },
      { name: "Garden View" },
      { name: "Pool View" },
      { name: "Mountain View" },
    ],
  });

  await prisma.facilityCategory.createMany({
    data: [
      { name: "Transportation" },
      { name: "Education" },
      { name: "Healthcare" },
      { name: "Shopping" },
    ],
  });
  console.log("Master data created.");

  // 4. Create Sample Properties
  console.log("Creating sample properties...");
  // PENDING property for admin to review
  await prisma.property.create({
    data: {
      title: "Cozy Studio Apartment at Margonda Residence V",
      description:
        "A fully furnished studio apartment, perfect for students or young professionals. Strategic location near Universitas Indonesia.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      rentalPrice: 3500000,
      paymentPeriod: "MONTHLY",
      sizeSqft: 250,
      bedrooms: 0, // Studio
      bathrooms: 1,
      furnishingStatus: "FULLY_FURNISHED",
      latitude: -6.363, // Depok
      longitude: 106.83,
      listedById: propertyOwner.id,
      projectId: project1.id,
      status: "PENDING", // This property will appear in the admin dashboard for approval
      documents: {
        create: {
          fileUrl: "https://example.com/docs/margonda-residence-cert.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
      amenities: {
        create: [
          { amenityId: amenities.find((a) => a.name === "Swimming Pool")!.id },
          { amenityId: amenities.find((a) => a.name === "24/7 Security")!.id },
        ],
      },
      views: {
        create: [{ viewId: views.find((v) => v.name === "City View")!.id }],
      },
    },
  });

  // APPROVED property that should be publicly visible
  await prisma.property.create({
    data: {
      title: "Spacious 2BR Unit at Mataram City",
      description:
        "A beautiful and spacious two-bedroom apartment with a stunning view of Mount Merapi. Family friendly with complete facilities.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      rentalPrice: 75000000,
      paymentPeriod: "YEARLY",
      sizeSqft: 750,
      bedrooms: 2,
      bathrooms: 2,
      furnishingStatus: "PARTIALLY_FURNISHED",
      latitude: -7.747, // Yogyakarta
      longitude: 110.36,
      listedById: propertyOwner.id,
      projectId: project2.id,
      status: "APPROVED",
      documents: {
        create: {
          fileUrl: "https://example.com/docs/mataram-city-cert.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
      amenities: {
        create: [
          { amenityId: amenities.find((a) => a.name === "Swimming Pool")!.id },
          { amenityId: amenities.find((a) => a.name === "Gymnasium")!.id },
          {
            amenityId: amenities.find((a) => a.name === "Covered Parking")!.id,
          },
        ],
      },
      views: {
        create: [
          { viewId: views.find((v) => v.name === "Mountain View")!.id },
          { viewId: views.find((v) => v.name === "City View")!.id },
        ],
      },
    },
  });
  console.log("Sample properties created.");

  console.log("Seeding finished.");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
