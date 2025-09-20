-- CreateEnum
CREATE TYPE "public"."TenancyStatus" AS ENUM ('PENDING_OWNER_APPROVAL', 'OWNER_REJECTED', 'PENDING_TENANT_PAYMENT', 'PENDING_SIGNATURES', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."TenancyAgreement" (
    "id" SERIAL NOT NULL,
    "status" "public"."TenancyStatus" NOT NULL DEFAULT 'PENDING_OWNER_APPROVAL',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "rentAmount" DOUBLE PRECISION NOT NULL,
    "docusignEnvelopeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "TenancyAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenancyAgreement_docusignEnvelopeId_key" ON "public"."TenancyAgreement"("docusignEnvelopeId");

-- AddForeignKey
ALTER TABLE "public"."TenancyAgreement" ADD CONSTRAINT "TenancyAgreement_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TenancyAgreement" ADD CONSTRAINT "TenancyAgreement_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TenancyAgreement" ADD CONSTRAINT "TenancyAgreement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
