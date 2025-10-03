export const PropertyCardSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm animate-pulse">
        <div className="h-56 bg-gray-200"></div>
        <div className="p-5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 my-3"></div>
        </div>
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);