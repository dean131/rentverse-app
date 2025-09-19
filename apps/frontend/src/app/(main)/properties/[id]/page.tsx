// File Path: apps/frontend/src/app/(main)/properties/[id]/page.tsx
import { getPropertyById } from '@/services/propertyService';
import { PropertyDetailClientPage } from '@/components/properties/PropertyDetailClientPage';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

export default async function PropertyDetailPage(
  props: PageProps<'/properties/[id]'>
) {
  const { params } = props;
  const { id } = await params;  // params sekarang Promise<{ id: string }>

  const propertyId = parseInt(id, 10);
  if (isNaN(propertyId)) {
    notFound();
  }

  const property = await getPropertyById(propertyId);
  if (!property) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="text-center py-20">Loading property details...</div>}>
      <PropertyDetailClientPage property={property} />
    </Suspense>
  );
}