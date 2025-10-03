// File Path: core-service/prisma/seed.ts
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
  console.log("🚀 Starting database seeding for the big demo...");

  // --- 1. CLEANUP ---
  console.log("🧹 Wiping the slate clean... Deleting existing data...");
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
  console.log("✅ Cleanup complete.");

  // --- 2. CREATE USERS ---
  console.log("👤 Creating a cast of characters (Users)...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin Rentverse",
      email: "admin@rentverse.com",
      password: hashedPassword,
      role: Role.ADMIN,
      profilePictureUrl:
        "https://ui-avatars.com/api/?name=Admin+Rentverse&background=2D3748&color=FFFFFF",
    },
  });

  const owner = await prisma.user.create({
    data: {
      fullName: "Budi Hartono",
      email: "owner@rentverse.com",
      password: hashedPassword,
      role: Role.PROPERTY_OWNER,
      profilePictureUrl:
        "https://ui-avatars.com/api/?name=Budi+Hartono&background=718096&color=FFFFFF",
    },
  });

  const tenant1 = await prisma.user.create({
    data: {
      fullName: "Citra Lestari",
      email: "tenant1@rentverse.com",
      password: hashedPassword,
      role: Role.TENANT,
      profilePictureUrl:
        "https://ui-avatars.com/api/?name=Citra+Lestari&background=E53E3E&color=FFFFFF",
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      fullName: "Doni Firmansyah",
      email: "tenant2@rentverse.com",
      password: hashedPassword,
      role: Role.TENANT,
      profilePictureUrl:
        "https://ui-avatars.com/api/?name=Doni+Firmansyah&background=3182CE&color=FFFFFF",
    },
  });
  console.log("✅ Users created: Admin, Property Owner, and 2 Tenants.");

  // --- 3. CREATE AMENITIES & VIEWS ---
  console.log("🛋️ Stocking up on Amenities and Views...");
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
      { name: "Full Kitchen" },
      { name: "High-Speed Internet" },
      { name: "Jacuzzi" },
      { name: "Sauna" },
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
    `✅ Created ${amenities.length} amenities and ${views.length} views.`
  );

  // --- 4. CREATE PROJECTS ---
  console.log("🏗️ Building out real-world Projects...");
  const projectJakarta = await prisma.project.create({
    data: {
      projectName: "District 8 Apartments",
      address: "Jl. Jend. Sudirman Kav. 52-53, Senayan, South Jakarta",
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
  console.log("✅ Projects created.");

  // --- 5. CREATE PROPERTIES ---
  console.log("🏡 Creating a portfolio of stunning Properties...");
  const approvedProperty1 = await prisma.property.create({
    data: {
      title: "Luxury 2BR Apartment in SCBD",
      description:
        "A beautifully furnished 2-bedroom apartment in the prestigious District 8 complex. Enjoy breathtaking city views and world-class facilities. Perfect for professionals and small families seeking a luxurious urban lifestyle with direct access to Jakarta's business district.",
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
              "https://images.unsplash.com/photo-1618221195710-dd6b41fa1299",
            displayOrder: 0,
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1595526114035-0d45ed16433d",
            displayOrder: 1,
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1556911220-bff31c812dba",
            displayOrder: 2,
          },
        ],
      },
      documents: {
        create: {
          fileUrl:
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
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

  await prisma.property.create({
    data: {
      title: "Serene Private Pool Villa in Canggu",
      description:
        "Experience the best of Bali in this private 2-bedroom villa with its own pool and lush garden. Just minutes away from the famous Batu Bolong beach, it is an ideal spot for a serene getaway or a productive remote work base.",
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
            "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd",
        },
      },
      documents: {
        create: {
          fileUrl:
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          documentType: "OWNERSHIP_CERTIFICATE",
        },
      },
    },
  });

  const otherPropertiesData = [
    {
      title: "Penthouse with Rooftop Jacuzzi",
      description:
        "The ultimate in luxury living. This duplex penthouse features a private rooftop terrace with a jacuzzi and panoramic city views.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.PENTHOUSE,
      rentalPrice: 45000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 3200,
      bedrooms: 4,
      bathrooms: 4,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      listedById: owner.id,
      projectId: projectJakarta.id,
      imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
    },
    {
      title: "Modern Family Home for Sale",
      description:
        "A brand new, modern minimalist home located in the secure and green Pondok Indah area. Features a spacious garden and a two-car garage.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.SALE,
      propertyType: PropertyType.HOUSE,
      rentalPrice: 2500000000,
      sizeSqft: 2800,
      bedrooms: 4,
      bathrooms: 3,
      furnishingStatus: FurnishingStatus.PARTIALLY_FURNISHED,
      listedById: owner.id,
      address: "Pondok Indah, South Jakarta",
      imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    },
    {
      title: "Cozy Studio Apartment in Bali",
      description:
        "A charming and fully-equipped studio apartment in the heart of Canggu. Includes a shared pool and is just a short scooter ride from the beach.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.STUDIO,
      rentalPrice: 7000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 450,
      bedrooms: 1,
      bathrooms: 1,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      listedById: owner.id,
      projectId: projectBali.id,
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    },
    {
      title: "Spacious Commercial Office Space",
      description:
        "Grade A office space in Mega Kuningan with high ceilings and an open-plan layout. Suitable for a tech startup or corporate headquarters.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.COMMERCIAL,
      rentalPrice: 350000000,
      paymentPeriod: PaymentPeriod.YEARLY,
      sizeSqft: 4000,
      bedrooms: 0,
      bathrooms: 2,
      furnishingStatus: FurnishingStatus.UNFURNISHED,
      listedById: owner.id,
      address: "Mega Kuningan, South Jakarta",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
    {
      title: "Affordable 3BR House",
      description:
        "An affordable and practical 3-bedroom home in a family-friendly neighborhood in Bekasi. Features a small garden and a one-car carport.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.HOUSE,
      rentalPrice: 85000000,
      paymentPeriod: PaymentPeriod.YEARLY,
      sizeSqft: 1200,
      bedrooms: 3,
      bathrooms: 2,
      furnishingStatus: FurnishingStatus.UNFURNISHED,
      listedById: owner.id,
      address: "Bekasi, West Java",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    },
    {
      title: "Beachfront Villa for Sale in Bali",
      description:
        "A once-in-a-lifetime opportunity to own a 5-bedroom villa with direct beach access in Seminyak. Features an infinity pool and sunset views.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.SALE,
      propertyType: PropertyType.HOUSE,
      rentalPrice: 7500000000,
      sizeSqft: 5000,
      bedrooms: 5,
      bathrooms: 5,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      listedById: owner.id,
      projectId: projectBali.id,
      imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    },
    {
      title: "High-Floor Apartment with City View",
      description:
        "Located on a high floor, this apartment offers stunning, unobstructed views of the Jakarta skyline. Comes with modern furnishings.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.APARTMENT,
      rentalPrice: 15000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 900,
      bedrooms: 2,
      bathrooms: 1,
      furnishingStatus: FurnishingStatus.PARTIALLY_FURNISHED,
      listedById: owner.id,
      projectId: projectJakarta.id,
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    },
    {
      title: "Minimalist House in a Quiet Neighborhood",
      description:
        "A beautiful minimalist house in a secure and quiet cluster in Bintaro. Perfect for those who value tranquility and modern design.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.SALE,
      propertyType: PropertyType.HOUSE,
      rentalPrice: 1800000000,
      sizeSqft: 1600,
      bedrooms: 3,
      bathrooms: 3,
      furnishingStatus: FurnishingStatus.UNFURNISHED,
      listedById: owner.id,
      address: "Bintaro, South Tangerang",
      imageUrl: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1",
    },
    {
      title: "Fully Serviced Studio in Kuningan",
      description:
        "A compact studio apartment in a serviced building. Includes weekly cleaning and utilities. Ideal for single professionals.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.STUDIO,
      rentalPrice: 9000000,
      paymentPeriod: PaymentPeriod.MONTHLY,
      sizeSqft: 400,
      bedrooms: 1,
      bathrooms: 1,
      furnishingStatus: FurnishingStatus.FULLY_FURNISHED,
      listedById: owner.id,
      projectId: projectJakarta.id,
      imageUrl: "https://images.unsplash.com/photo-1594563703937-fdc640497dcd",
    },
    {
      title: "Large Warehouse for Rent",
      description:
        "A massive 10,000 sqft warehouse with high ceilings and loading docks, located in an industrial park in Cikarang.",
      status: PropertyStatus.APPROVED,
      listingType: ListingType.RENT,
      propertyType: PropertyType.COMMERCIAL,
      rentalPrice: 500000000,
      paymentPeriod: PaymentPeriod.YEARLY,
      sizeSqft: 10000,
      bedrooms: 0,
      bathrooms: 2,
      furnishingStatus: FurnishingStatus.UNFURNISHED,
      listedById: owner.id,
      address: "Cikarang, West Java",
      imageUrl: "https://images.unsplash.com/photo-1587022019913-170438a48858",
    },
    {
      title: "Under Construction Apartment Complex",
      description:
        "An opportunity to purchase a new apartment off-plan in a rising development area in Alam Sutera. Handover expected in Q4 2026.",
      status: PropertyStatus.PENDING,
      listingType: ListingType.SALE,
      propertyType: PropertyType.APARTMENT,
      rentalPrice: 800000000,
      sizeSqft: 750,
      bedrooms: 2,
      bathrooms: 1,
      furnishingStatus: FurnishingStatus.UNFURNISHED,
      listedById: owner.id,
      address: "Alam Sutera, Tangerang",
      imageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324",
    },
  ];

  for (const propData of otherPropertiesData) {
    const { imageUrl, ...rest } = propData;
    await prisma.property.create({
      data: {
        ...rest,
        images: { create: { imageUrl } },
        documents: {
          create: {
            fileUrl:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            documentType: "OWNERSHIP_CERTIFICATE",
          },
        },
      },
    });
  }
  console.log(
    `✅ Created ${otherPropertiesData.length} additional properties.`
  );

  // --- 6. CREATE TENANCY AGREEMENTS FOR DEMO ---
  console.log(
    "✍️ Creating sample Tenancy Agreements to showcase the workflow..."
  );
  await prisma.tenancyAgreement.create({
    data: {
      propertyId: approvedProperty1.id,
      ownerId: owner.id,
      tenantId: tenant1.id,
      status: TenancyStatus.PENDING_OWNER_APPROVAL,
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-10-31"),
      rentAmount: 25000000,
    },
  });
  await prisma.tenancyAgreement.create({
    data: {
      propertyId: approvedProperty1.id,
      ownerId: owner.id,
      tenantId: tenant2.id,
      status: TenancyStatus.PENDING_SIGNATURES,
      startDate: new Date("2025-12-01"),
      endDate: new Date("2026-11-30"),
      rentAmount: 26000000,
      docusignEnvelopeId: "demo-envelope-pending-sig",
    },
  });
  await prisma.tenancyAgreement.create({
    data: {
      propertyId: approvedProperty1.id,
      ownerId: owner.id,
      tenantId: tenant1.id,
      status: TenancyStatus.ACTIVE,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2025-01-31"),
      rentAmount: 24000000,
      docusignEnvelopeId: "demo-envelope-active",
    },
  });
  console.log("✅ Created 3 sample tenancy agreements in different states.");

  console.log(
    "\n🎉 Seeding for demo finished successfully! Your app is ready to impress. ✨"
  );
}

main()
  .catch(async (e) => {
    console.error("❌ An error occurred during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
