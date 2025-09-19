// File Path: apps/frontend/src/components/properties/form-steps/Step2Location.tsx
'use client';

import { useEffect, useState, ReactNode, SelectHTMLAttributes } from 'react';
import { UseFormRegister, FieldErrors, Path, FieldError } from 'react-hook-form';
import { PropertySubmission, Project } from '@/lib/definitions';
import { getProjects } from '@/services/propertyService';

interface Step2Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
}

// Define strong types for the reusable FormSelect component's props
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: Path<PropertySubmission>;
    register: UseFormRegister<PropertySubmission>;
    error?: FieldError;
    children: ReactNode;
}

// Reusable select component, now fully type-safe
const FormSelect = ({ label, name, register, error, children, ...props }: FormSelectProps) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name}
            {...register(name)}
            {...props}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
        >
            {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
);


export const Step2Location = ({ register, errors }: Step2Props) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Location</h3>
            <p className="text-sm text-gray-500">
                You can either link this property to an existing project/building or provide a new address.
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
        </div>
    );
};

