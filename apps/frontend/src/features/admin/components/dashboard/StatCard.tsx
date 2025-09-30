// File Path: apps/frontend/src/components/admin/dashboard/StatCard.tsx
export const StatCard = ({ title, value, thisMonth }: { title: string; value: number | string; thisMonth?: number }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    {thisMonth !== undefined && <p className="text-sm text-gray-500 mt-1">This months document: {thisMonth}</p>}
  </div>
);
