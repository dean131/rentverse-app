// File Path: apps/core-service/prisma/seed.ts
import {
  PrismaClient,
  Role,
  PropertyStatus,
  ListingType,
  PropertyType,
  FurnishingStatus,
  PaymentPeriod,
  TenancyStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding for demo...");

  // --- 1. CLEANUP ---
  console.log("Cleaning up existing data...");
  await prisma.tenancyAgreement.deleteMany({});
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
  console.log("Creating diverse user roles...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Rentverse",
      email: "admin@rentverse.com",
      password: hashedPassword,
      role: Role.ADMIN,
      profilePictureUrl:
        "https://placehold.co/100x100/2D3748/FFFFFF/png?text=Admin",
    },
  });

  const owner = await prisma.user.create({
    data: {
      fullName: "Budi Hartono",
      email: "owner@rentverse.com",
      password: hashedPassword,
      role: Role.PROPERTY_OWNER,
      profilePictureUrl:
        "https://placehold.co/100x100/718096/FFFFFF/png?text=Owner",
    },
  });

  const tenant1 = await prisma.user.create({
    data: {
      fullName: "Citra Lestari",
      email: "tenant1@rentverse.com",
      password: hashedPassword,
      role: Role.TENANT,
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      fullName: "Doni Firmansyah",
      email: "tenant2@rentverse.com",
      password: hashedPassword,
      role: Role.TENANT,
    },
  });
  console.log(`Created users: Admin, Owner, and 2 Tenants.`);

  // --- 3. CREATE AMENITIES & VIEWS ---
  console.log("Creating realistic amenities and views in Bahasa Indonesia...");
  const amenities = await prisma.amenity.createManyAndReturn({
    data: [
      { name: "Kolam Renang" },
      { name: "Gymnasium" },
      { name: "Keamanan 24 Jam" },
      { name: "Taman Bermain" },
      { name: "Balkon" },
      { name: "Parkir Tertutup" },
      { name: "AC" },
      { name: "Mesin Cuci" },
      { name: "Dapur Lengkap" },
      { name: "Internet Cepat" },
    ],
  });

  const views = await prisma.view.createManyAndReturn({
    data: [
      { name: "Pemandangan Kota" },
      { name: "Pemandangan Laut" },
      { name: "Pemandangan Kolam" },
      { name: "Pemandangan Taman" },
      { name: "Pemandangan Gunung" },
    ],
  });
  console.log(
    `Created ${amenities.length} amenities and ${views.length} views.`
  );

  // --- 4. CREATE PROJECTS ---
  console.log("Creating real-world projects...");
  const projectJakarta = await prisma.project.create({
    data: {
      projectName: "District 8 Apartments",
      address: "Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan",
      latitude: -6.2246,
      longitude: 106.8055,
    },
  });
  const projectBali = await prisma.project.create({
    data: {
      projectName: "Canggu Villa Complex",
      address: "Jl. Pantai Batu Bolong, Canggu, Bali",
      latitude: -8.6595,
      longitude: 115.1277,
    },
  });
  const projectSurabaya = await prisma.project.create({
    data: {
      projectName: "Pakuwon Indah Residences",
      address: "Jl. Puncak Indah Lontar No. 2, Babatan, Wiyung, Surabaya",
      latitude: -7.2893,
      longitude: 112.6749,
    },
  });
  const projectBandung = await prisma.project.create({
    data: {
      projectName: "Gateway Pasteur Apartment",
      address: "Jl. Gunung Batu No. 203, Pasteur, Bandung",
      latitude: -6.8863,
      longitude: 107.5613,
    },
  });
  console.log(`Created projects: Jakarta, Bali, Surabaya, and Bandung.`);

  // --- 5. CREATE PROPERTIES ---
  console.log("Creating diverse properties for demo...");
  const approvedProperty1 = await prisma.property.create({
    data: {
      title: "Modern 2BR Apartment in SCBD",
      description:
        "A beautifully furnished 2-bedroom apartment located in the prestigious District 8 complex. Enjoy breathtaking city views and world-class facilities. Perfect for professionals and small families seeking a luxurious urban lifestyle.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.APARTMENT,
      rentalPrice: 25000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 1050,
      bedrooms: 2,
      bathrooms: 2,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      latitude: -6.2246,
      longitude: 106.8055,
      listedById: owner.id,
      projectId: projectJakarta.id,
      images: {
        create: [
          {
            imageUrl:
              "https://placehold.co/600x400/2D3748/FFFFFF/jpg?text=Living+Room",
            displayOrder: 0,
          },
          {
            imageUrl:
              "https://placehold.co/600x400/718096/FFFFFF/jpg?text=Bedroom",
            displayOrder: 1,
          },
        ],
      },
      documents: {
        create: {
          fileUrl: "https://example.com/doc/scbd_apartment.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
      amenities: {
        create: [
          { amenityId: amenities[0].id },
          { amenityId: amenities[1].id },
          { amenityId: amenities[2].id },
        ],
      },
      views: { create: [{ viewId: views[0].id }] },
    },
  });

  const pendingProperty = await prisma.property.create({
    data: {
      title: "Private Pool Villa in Canggu",
      description:
        "Experience the best of Bali in this private 2-bedroom villa with its own pool. Just minutes away from the famous Batu Bolong beach. Ideal for a serene getaway or a remote work base.",
      status: PropertyStatus.PENDING,
      listingType: ListingType.RENT,
      propertyType: PropertyType.HOUSE,
      rentalPrice: 30000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 1500,
      bedrooms: 2,
      bathrooms: 2,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      latitude: -8.6595,
      longitude: 115.1277,
      listedById: owner.id,
      projectId: projectBali.id,
      images: {
        create: {
          imageUrl:
            "https://placehold.co/600x400/DD6B20/FFFFFF/jpg?text=Villa+Pool",
        },
      },
      documents: {
        create: {
          fileUrl: "https://example.com/doc/canggu_villa.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
    },
  });

  // Add 10 more properties
  await prisma.property.createMany({
    data: [
      // Approved Properties
      {
        title: "Cozy Studio in Surabaya",
        description: "Compact and modern studio in Pakuwon Indah.",
        status: "APPROVED",
        listingType: "RENT",
        propertyType: "STUDIO",
        rentalPrice: 5000000,
        paymentPeriod: "MONTHLY",
        sizeSqft: 350,
        bedrooms: 1,
        bathrooms: 1,
        furnishingStatus: "FULLY_FURNISHED",
        listedById: owner.id,
        projectId: projectSurabaya.id,
      },
      {
        title: "Family Home in Pasteur, Bandung",
        description: "Spacious 3-bedroom house, perfect for families.",
        status: "APPROVED",
        listingType: "SALE",
        propertyType: "HOUSE",
        rentalPrice: 1200000000,
        sizeSqft: 2000,
        bedrooms: 3,
        bathrooms: 2,
        furnishingStatus: "PARTIALLY_FURNISHED",
        listedById: owner.id,
        projectId: projectBandung.id,
      },
      {
        title: "Penthouse with City View, Jakarta",
        description:
          "Top-floor penthouse with stunning panoramic views of the city skyline.",
        status: "APPROVED",
        listingType: "RENT",
        propertyType: "PENTHOUSE",
        rentalPrice: 45000000,
        paymentPeriod: "YEARLY",
        sizeSqft: 2500,
        bedrooms: 4,
        bathrooms: 4,
        furnishingStatus: "FULLY_FURNISHED",
        listedById: owner.id,
        projectId: projectJakarta.id,
      },
      {
        title: "Commercial Space in Central Bali",
        description:
          "Prime commercial space suitable for a cafe or boutique shop.",
        status: "APPROVED",
        listingType: "RENT",
        propertyType: "COMMERCIAL",
        rentalPrice: 100000000,
        paymentPeriod: "YEARLY",
        sizeSqft: 1800,
        bedrooms: 0,
        bathrooms: 1,
        furnishingStatus: "UNFURNISHED",
        listedById: owner.id,
        projectId: projectBali.id,
      },
      {
        title: "Affordable Apartment in Bandung",
        description:
          "A budget-friendly 2-bedroom apartment, great for students.",
        status: "APPROVED",
        listingType: "RENT",
        propertyType: "APARTMENT",
        rentalPrice: 3500000,
        paymentPeriod: "MONTHLY",
        sizeSqft: 600,
        bedrooms: 2,
        bathrooms: 1,
        furnishingStatus: "UNFURNISHED",
        listedById: owner.id,
        projectId: projectBandung.id,
      },

      // Pending Properties
      {
        title: "New House Development in Surabaya",
        description:
          "Be the first to live in this brand new house in a developing area.",
        status: "PENDING",
        listingType: "SALE",
        propertyType: "HOUSE",
        rentalPrice: 950000000,
        sizeSqft: 1600,
        bedrooms: 3,
        bathrooms: 2,
        furnishingStatus: "UNFURNISHED",
        listedById: owner.id,
        projectId: projectSurabaya.id,
      },
      {
        title: "Renovated Apartment near Sudirman",
        description: "Beautifully renovated apartment with modern interiors.",
        status: "PENDING",
        listingType: "RENT",
        propertyType: "APARTMENT",
        rentalPrice: 18000000,
        paymentPeriod: "MONTHLY",
        sizeSqft: 950,
        bedrooms: 2,
        bathrooms: 1,
        furnishingStatus: "FULLY_FURNISHED",
        listedById: owner.id,
        projectId: projectJakarta.id,
      },

      // Rejected Property
      {
        title: "Old House in need of repair",
        description: "Listing with unclear photos and missing documentation.",
        status: "REJECTED",
        listingType: "SALE",
        propertyType: "HOUSE",
        rentalPrice: 400000000,
        sizeSqft: 1300,
        bedrooms: 3,
        bathrooms: 1,
        furnishingStatus: "UNFURNISHED",
        listedById: owner.id,
      },

      // Rented Property
      {
        title: "Rented - Student Kost in Bandung",
        description: "This property has been rented out.",
        status: "RENTED",
        listingType: "RENT",
        propertyType: "HOUSE",
        rentalPrice: 2000000,
        paymentPeriod: "MONTHLY",
        sizeSqft: 200,
        bedrooms: 1,
        bathrooms: 1,
        furnishingStatus: "PARTIALLY_FURNISHED",
        listedById: owner.id,
        projectId: projectBandung.id,
      },
      {
        title: "Sold - Villa with Sea View",
        description: "This beautiful villa in Bali has been sold.",
        status: "SOLD",
        listingType: "SALE",
        propertyType: "HOUSE",
        rentalPrice: 3500000000,
        sizeSqft: 3000,
        bedrooms: 4,
        bathrooms: 3,
        furnishingStatus: "FULLY_FURNISHED",
        listedById: owner.id,
        projectId: projectBali.id,
      },
    ],
  });
  console.log("Created 10 additional sample properties.");

  // --- 6. CREATE TENANCY AGREEMENTS FOR DEMO ---
  console.log(
    "Creating sample tenancy agreements to showcase different states..."
  );
  // Scenario 1: Tenant 1 requests to book the approved Jakarta property
  await prisma.tenancyAgreement.create({
    data: {
      propertyId: approvedProperty1.id,
      ownerId: owner.id,
      tenantId: tenant1.id,
      status: TenancyStatus.PENDING_OWNER_APPROVAL,
      startDate: new Date("2025-10-01"),
      endDate: new Date("2026-09-30"),
      rentAmount: 25000000,
    },
  });

  // Scenario 2: A separate agreement that is already pending signatures
  await prisma.tenancyAgreement.create({
    data: {
      propertyId: approvedProperty1.id, // Using the same property for simplicity
      ownerId: owner.id,
      tenantId: tenant2.id,
      status: TenancyStatus.PENDING_SIGNATURES,
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-10-31"),
      rentAmount: 26000000,
      docusignEnvelopeId: "sample-envelope-id-for-demo", // Placeholder for demo
    },
  });

  // Scenario 3: An active agreement
  await prisma.tenancyAgreement.create({
    data: {
      propertyId: approvedProperty1.id,
      ownerId: owner.id,
      tenantId: tenant1.id,
      status: TenancyStatus.ACTIVE,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      rentAmount: 24000000,
      docusignEnvelopeId: "sample-envelope-id-for-demo-456",
    },
  });

  console.log("Created 3 sample tenancy agreements.");

  console.log("\n✅ Seeding for demo finished successfully!");
}

main()
  .catch(async (e) => {
    console.error("An error occurred during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
