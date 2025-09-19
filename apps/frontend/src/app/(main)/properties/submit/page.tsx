// File Path: apps/frontend/src/app/(main)/properties/submit/page.tsx
import { PropertySubmissionForm } from "@/components/properties/PropertySubmissionForm";

export default function SubmitPropertyPage() {
  return (
    // The main layout for the submission page, providing a clean background and centering.
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">List a new Property</h1>
            <p className="mt-2 text-sm text-gray-600">Fill in the details below to post your property and reach thousands of potential tenants.</p>
        </div>
        <div className="mt-8">
            <PropertySubmissionForm />
        </div>
      </div>
    </div>
  );
}