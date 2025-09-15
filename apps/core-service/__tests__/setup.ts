import { prisma } from "../src/lib/prisma.js";

/**
 * A comprehensive cleanup function that deletes data from all tables,
 * respecting the order of foreign key constraints to prevent errors.
 */
export const cleanDb = async () => {
  // Start with tables that have the most dependencies (join tables)
  await prisma.propertyAmenity.deleteMany({});
  await prisma.propertyView.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.propertyDocument.deleteMany({});
  await prisma.nearbyFacility.deleteMany({});
  await prisma.rentalAgreement.deleteMany({});

  // Now delete tables that are depended upon
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});

  // Finally, delete the master data tables
  await prisma.project.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.view.deleteMany({});
  await prisma.facilityCategory.deleteMany({});
};
