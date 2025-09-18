// File Path: apps/frontend/src/components/home/FeaturedProperties.tsx
'use client';

import { useEffect, useState } from 'react';
import { PropertyPublic } from '@/lib/definitions';
import { getPublicProperties } from '@/services/propertyService';
import { PropertyCard } from './PropertyCard'; // Corrected import path

export const FeaturedProperties = () => {
    const [properties, setProperties] = useState<PropertyPublic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getPublicProperties();
                setProperties(data);
            } catch (err) {
                console.error("Failed to fetch public properties:", err);
                setError("Could not load properties at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (isLoading) {
        return <div className="text-center py-12">Loading properties...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Find the property that defines your lifestyle
                    </h2>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* This component now directly passes the property object.
                      The optional chaining logic is handled inside PropertyCard.tsx 
                      which is the best practice for component design.
                    */}
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </section>
    );
};

