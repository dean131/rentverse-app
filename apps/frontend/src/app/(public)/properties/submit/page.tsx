// File Path: apps/frontend/src/app/(main)/properties/submit/page.tsx
import { PropertySubmissionForm } from "@/components/properties/PropertySubmissionForm";

// This page now provides a clean background and title for the form.
export default function SubmitPropertyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">List a New Property</h1>
            <p className="mt-2 text-lg text-gray-600">Fill in the details below to post your property and reach thousands of potential tenants.</p>
        </div>
        <PropertySubmissionForm />
      </div>
    </div>
  );
}

