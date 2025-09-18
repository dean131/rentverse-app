// File Path: apps/frontend/src/components/home/Stats.tsx
export const Stats = () => {
  const stats = [
    { value: '750+', label: 'Successfully built over 750 unique homes tailored to clients desires' },
    { value: '200+', label: 'Expertise in crafting residential and commercial spaces from offices to retail' },
    { value: '15+', label: 'A decade of dedicated service ensuring industry-leading quality' },
    { value: '50+', label: 'Successful commercial projects delivered for various industries' },
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by Hundreds, Recognized for Excellence.</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-5xl font-extrabold text-orange-600">{stat.value}</p>
              <p className="mt-2 text-base text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
