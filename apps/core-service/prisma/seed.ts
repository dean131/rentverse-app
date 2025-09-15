import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Clean up existing data to ensure a fresh start
  // The order is important to respect foreign key constraints
  console.log("Cleaning database...");
  await prisma.propertyAmenity.deleteMany({});
  await prisma.propertyView.deleteMany({});
  await prisma.propertyDocument.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.rentalAgreement.deleteMany({});
  await prisma.nearbyFacility.deleteMany({});
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
  const adminPassword = await bcrypt.hash("password123", saltRounds);
  const ownerPassword = await bcrypt.hash("password123", saltRounds);
  const tenantPassword = await bcrypt.hash("password123", saltRounds);

  const admin = await prisma.user.create({
    data: {
      fullName: "Admin User",
      email: "admin@rentverse.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const propertyOwner = await prisma.user.create({
    data: {
      fullName: "Budi Owner",
      email: "owner@rentverse.com",
      password: ownerPassword,
      role: Role.PROPERTY_OWNER,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      fullName: "Citra Tenant",
      email: "tenant@rentverse.com",
      password: tenantPassword,
      role: Role.TENANT,
    },
  });
  console.log("Users created:", { admin, propertyOwner, tenant });

  // 3. Create Master Data (Projects, Amenities, Views, Facility Categories)
  console.log("Creating master data...");
  const project1 = await prisma.project.create({
    data: {
      projectName: "Tijani Raja Dewa - Apartments",
      developer: "Symphony Life Berhad",
      address: "Panji, Kota Bharu, Kelantan",
    },
  });

  const amenityPool = await prisma.amenity.create({
    data: { name: "Swimming Pool" },
  });
  const amenityGym = await prisma.amenity.create({
    data: { name: "Gymnasium" },
  });
  const amenityParking = await prisma.amenity.create({
    data: { name: "Covered Parking" },
  });

  const viewCity = await prisma.view.create({ data: { name: "City View" } });
  const viewGarden = await prisma.view.create({
    data: { name: "Garden View" },
  });
  const viewSea = await prisma.view.create({ data: { name: "Sea View" } });

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
  const property1 = await prisma.property.create({
    data: {
      title: "Luxury Apartment with Stunning City View",
      description:
        "A beautiful 2-bedroom apartment in the city center. Fully furnished and ready to move in.",
      listingType: "RENT",
      propertyType: "APARTMENT",
      rentalPrice: 5000000,
      paymentPeriod: "MONTHLY",
      sizeSqft: 1200,
      bedrooms: 2,
      bathrooms: 2,
      furnishingStatus: "FULLY_FURNISHED",
      latitude: -6.2,
      longitude: 106.8,
      listedById: propertyOwner.id,
      projectId: project1.id,
      status: "PENDING", // This property will appear in the admin dashboard for approval
      amenities: {
        create: [{ amenityId: amenityPool.id }, { amenityId: amenityGym.id }],
      },
      views: {
        create: [{ viewId: viewCity.id }],
      },
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: "Cozy House with Private Garden",
      description:
        "A charming 3-bedroom house perfect for families. Features a beautiful private garden.",
      listingType: "RENT",
      propertyType: "HOUSE",
      rentalPrice: 8000000,
      paymentPeriod: "YEARLY",
      sizeSqft: 1800,
      bedrooms: 3,
      bathrooms: 2,
      furnishingStatus: "PARTIALLY_FURNISHED",
      latitude: -6.21,
      longitude: 106.81,
      listedById: propertyOwner.id,
      status: "APPROVED", // This property will be visible to the public
      amenities: {
        create: [{ amenityId: amenityParking.id }],
      },
      views: {
        create: [{ viewId: viewGarden.id }],
      },
    },
  });
  console.log("Sample properties created:", { property1, property2 });

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
