// File Path: apps/frontend/src/components/properties/form-steps/Step2Location.tsx
'use client';

import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PropertySubmission, Project } from '@/lib/definitions';
import { getProjects } from '@/features/properties/propertyService';
import { FormSelect } from '@/ui/ui/FormSelect';

interface Step2Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
}


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
                Link this property to an existing project or building to automatically fill in the address.
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