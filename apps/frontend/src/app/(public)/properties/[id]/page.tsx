// File Path: apps/frontend/src/app/(main)/properties/[id]/page.tsx
import { getPropertyById } from '@/features/properties/propertyService';
import { PropertyDetailClientPage } from '@/features/properties/components/PropertyDetailClientPage';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { AxiosError } from "axios";

export default async function PropertyDetailPage(
  props: PageProps<'/properties/[id]'>
) {
  const { id } = await props.params;

  const propertyId = parseInt(id, 10);
  if (isNaN(propertyId)) {
    notFound();
  }

  let property = null;
  try {
    property = await getPropertyById(propertyId);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return (
          <div className="text-center py-20">
            Property belum tersedia atau masih dalam proses approval.
          </div>
        );
      }
    }
    throw error;
  }

  if (!property) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="text-center py-20">Loading property details...</div>}>
      <PropertyDetailClientPage property={property} />
    </Suspense>
  );
}
