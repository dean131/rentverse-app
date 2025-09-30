// File Path: apps/frontend/src/components/admin/layout/Icon.tsx
export const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg className={`h-6 w-6 ${className}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);
