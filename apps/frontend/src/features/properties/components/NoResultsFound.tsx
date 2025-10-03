export const NoResultsFound = () => (
    <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
        <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m-3 1l-3 1m-3-1l3 1m0 0l.5 1.5m-.5-1.5L9 9.5" />
            </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-800">No Properties Found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what youre looking for.</p>
    </div>
);
