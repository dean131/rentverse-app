// File Path: apps/frontend/src/components/home/Stats.tsx

interface StatItemProps {
    value: string;
    label: string;
}

const StatItem = ({ value, label }: StatItemProps) => (
    <div className="text-center">
        <p className="text-5xl font-bold text-orange-400">{value}</p>
        <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">{label}</p>
    </div>
);


export const Stats = () => {
    const statsData = [
        { value: "750+", label: "Successfully built over 750 unique homes tailored to each client's vision." },
        { value: "200+", label: "Expertise in building functional and inspiring spaces, from offices to retail." },
        { value: "15+", label: "A decade of dedicated expertise ensuring timeless quality." },
        { value: "50+", label: "Honored with numerous industry awards for our innovative." },
    ];

    return (
        // CORRECTED: Changed to a light theme with a light gray background and adjusted text colors for contrast.
        <section className="bg-gray-50 text-gray-800 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by Hundreds, Recognized for Excellence.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {statsData.map((stat) => (
                        <StatItem key={stat.label} value={stat.value} label={stat.label} />
                    ))}
                </div>
            </div>
        </section>
    );
};

