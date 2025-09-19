// File Path: apps/core-service/prisma/seed.ts
import {
  PrismaClient,
  Role,
  PropertyStatus,
  ListingType,
  PropertyType,
  FurnishingStatus,
  PaymentPeriod,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // --- 1. CLEANUP ---
  // Delete data in a specific order to avoid foreign key constraint errors
  console.log("Cleaning up existing data...");
  await prisma.propertyAmenity.deleteMany({});
  await prisma.propertyView.deleteMany({});
  await prisma.propertyDocument.deleteMany({});
  await prisma.propertyImage.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.view.deleteMany({});
  console.log("Cleanup complete.");

  // --- 2. CREATE USERS ---
  console.log("Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin User",
      email: "admin@rentverse.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const owner = await prisma.user.create({
    data: {
      fullName: "Property Owner",
      email: "owner@rentverse.com",
      password: hashedPassword,
      role: Role.PROPERTY_OWNER,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      fullName: "Tenant User",
      email: "tenant@rentverse.com",
      password: hashedPassword,
      role: Role.TENANT,
    },
  });
  console.log(`Created users: ${admin.email}, ${owner.email}, ${tenant.email}`);

  // --- 3. CREATE AMENITIES & VIEWS ---
  console.log("Creating amenities and views...");
  const amenities = await prisma.amenity.createManyAndReturn({
    data: [
      { name: "Swimming Pool" },
      { name: "Gymnasium" },
      { name: "24/7 Security" },
      { name: "Playground" },
      { name: "Balcony" },
      { name: "Covered Parking" },
      { name: "Air Conditioning" },
      { name: "Washing Machine" },
      { name: "Kitchen Cabinet" },
    ],
  });

  const views = await prisma.view.createManyAndReturn({
    data: [
      { name: "City View" },
      { name: "Sea View" },
      { name: "Pool View" },
      { name: "Garden View" },
      { name: "Mountain View" },
    ],
  });
  console.log(
    `Created ${amenities.length} amenities and ${views.length} views.`
  );

  // --- 4. CREATE PROJECTS ---
  console.log("Creating projects...");
  const project1 = await prisma.project.create({
    data: {
      projectName: "Taman Anggrek Residences",
      address:
        "Jl. Letjend S. Parman Kav. 21, Tanjung Duren Selatan, Grogol Petamburan, Jakarta Barat",
    },
  });
  console.log(`Created project: ${project1.projectName}`);

  // --- 5. CREATE PROPERTIES ---
  console.log("Creating properties...");
  // Property 1: Approved, linked to project
  await prisma.property.create({
    data: {
      title: "Luxurious 2BR Apartment at Taman Anggrek",
      description:
        "Fully furnished 2-bedroom apartment with a stunning city view. Comes with complete amenities and direct mall access.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.APARTMENT,
      rentalPrice: 15000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 88,
      bedrooms: 2,
      bathrooms: 1,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      listedById: owner.id,
      projectId: project1.id,
      images: {
        create: [
          {
            imageUrl:
              "https://placehold.co/600x400/F99933/FFFFFF/jpg?text=Living+Room",
            displayOrder: 0,
          },
          {
            imageUrl:
              "https://placehold.co/600x400/F99933/FFFFFF/jpg?text=Bedroom",
            displayOrder: 1,
          },
        ],
      },
      documents: {
        create: {
          fileUrl: "https://example.com/doc1.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
      amenities: {
        create: [
          { amenityId: amenities.find((a) => a.name === "Swimming Pool")!.id },
          { amenityId: amenities.find((a) => a.name === "Gymnasium")!.id },
        ],
      },
      views: {
        create: [{ viewId: views.find((v) => v.name === "City View")!.id }],
      },
    },
  });

  // Property 2: Pending, standalone
  await prisma.property.create({
    data: {
      title: "Cozy Studio in Kemang",
      description:
        "A quiet and comfortable studio apartment in the heart of South Jakarta. Perfect for a single professional.",
      status: PropertyStatus.PENDING,
      listingType: ListingType.RENT,
      propertyType: PropertyType.STUDIO,
      rentalPrice: 7000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 35,
      bedrooms: 1,
      bathrooms: 1,
      furnishingStatus: FurnishingStatus.PARTIALLY_FURNISHED,
      listedById: owner.id,
      images: {
        create: {
          imageUrl:
            "https://placehold.co/600x400/F99933/FFFFFF/jpg?text=Studio",
        },
      },
      documents: {
        create: {
          fileUrl: "https://example.com/doc2.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
      amenities: {
        create: [
          {
            amenityId: amenities.find((a) => a.name === "Air Conditioning")!.id,
          },
        ],
      },
    },
  });

  console.log("Created 2 sample properties.");
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
