/*
  Warnings:

  - The values [TAX_RECORD,UTILITY_BILL] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `icon` on the `Amenity` table. All the data in the column will be lost.
  - You are about to drop the column `completionDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `developer` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceFee` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `PropertyDocument` table. All the data in the column will be lost.
  - You are about to drop the `FacilityCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NearbyFacility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RentalAgreement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `furnishingStatus` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FurnishingStatus" AS ENUM ('FULLY_FURNISHED', 'PARTIALLY_FURNISHED', 'UNFURNISHED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."DocumentType_new" AS ENUM ('OWNERSHIP_CERTIFICATE', 'FLOOR_PLAN', 'OTHER');
ALTER TABLE "public"."PropertyDocument" ALTER COLUMN "documentType" TYPE "public"."DocumentType_new" USING ("documentType"::text::"public"."DocumentType_new");
ALTER TYPE "public"."DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "public"."DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "public"."DocumentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NearbyFacility" DROP CONSTRAINT "NearbyFacility_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NearbyFacility" DROP CONSTRAINT "NearbyFacility_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyAmenity" DROP CONSTRAINT "PropertyAmenity_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyAmenity" DROP CONSTRAINT "PropertyAmenity_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyDocument" DROP CONSTRAINT "PropertyDocument_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyImage" DROP CONSTRAINT "PropertyImage_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyView" DROP CONSTRAINT "PropertyView_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyView" DROP CONSTRAINT "PropertyView_viewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalAgreement" DROP CONSTRAINT "RentalAgreement_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalAgreement" DROP CONSTRAINT "RentalAgreement_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RentalAgreement" DROP CONSTRAINT "RentalAgreement_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Amenity" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "completionDate",
DROP COLUMN "developer",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "maintenanceFee",
DROP COLUMN "salePrice",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "furnishingStatus",
ADD COLUMN     "furnishingStatus" "public"."FurnishingStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."PropertyDocument" DROP COLUMN "verificationStatus";

-- AlterTable
ALTER TABLE "public"."RefreshToken" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."FacilityCategory";

-- DropTable
DROP TABLE "public"."Favorite";

-- DropTable
DROP TABLE "public"."NearbyFacility";

-- DropTable
DROP TABLE "public"."RentalAgreement";

-- DropTable
DROP TABLE "public"."Review";

-- DropEnum
DROP TYPE "public"."AgreementStatus";

-- DropEnum
DROP TYPE "public"."Furnishing";

-- DropEnum
DROP TYPE "public"."VerificationStatus";

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "public"."RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyDocument" ADD CONSTRAINT "PropertyDocument_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "public"."Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyView" ADD CONSTRAINT "PropertyView_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyView" ADD CONSTRAINT "PropertyView_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "public"."View"("id") ON DELETE CASCADE ON UPDATE CASCADE;
