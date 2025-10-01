// File Path: apps/frontend/src/components/properties/form-steps/Step2Location.tsx
'use client';

import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { PropertySubmission, Project } from '@/lib/definitions';
import { getProjects } from '@/features/properties/propertyService';
import { FormSelect } from '@/ui/ui/FormSelect';
import { FormInput } from '@/ui/ui/FormInput';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('./LocationMap').then(mod => mod.LocationMap), { ssr: false });

interface Step2Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
    watch: UseFormWatch<PropertySubmission>;
    setValue: UseFormSetValue<PropertySubmission>;
}


export const Step2Location = ({ register, errors, watch, setValue }: Step2Props) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectedProjectId = watch('projectId');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectData = await getProjects();
                setProjects(projectData);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleLocationSelect = (lat: number, lng: number) => {
        setValue('latitude', lat, { shouldValidate: true, shouldDirty: true });
        setValue('longitude', lng, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Location</h3>
            <p className="text-sm text-gray-500">
                You can either link this property to an existing project or enter a new address and select the location on the map.
            </p>
            
            <FormSelect
                label="Select Project (Optional)"
                name="projectId"
                register={register}
                error={errors.projectId}
                disabled={isLoading}
            >
                <option value="">{isLoading ? "Loading projects..." : "Select an existing project"}</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.projectName}
                    </option>
                ))}
            </FormSelect>

            {/* If a project is selected, the address is handled by the project */}
            {!selectedProjectId && (
                <div className="space-y-6">
                    <FormInput
                        label="Full Property Address"
                        name="address"
                        register={register}
                        error={errors.address}
                        placeholder="e.g., Jl. Jend. Sudirman No.Kav. 52-53, RT.5/RW.3"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Location on Map</label>
                         <p className="text-sm text-gray-500 mb-2">
                            Click on the map to set the exact coordinates of the property.
                        </p>
                        <LocationMap onLocationSelect={handleLocationSelect} />
                        <input type="hidden" {...register('latitude')} />
                        <input type="hidden" {...register('longitude')} />
                         {errors.latitude && <p className="mt-1 text-sm text-red-600">Please select a location on the map.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};
