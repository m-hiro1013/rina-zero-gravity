'use client';

import { Project } from '@/types';
import { ProjectItem } from '../projects/ProjectItem';
import { Pin } from 'lucide-react';

interface PinnedSectionProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (categoryId: string, projectId: string) => void;
    onTogglePin: (categoryId: string, projectId: string, pinned: boolean) => void;
    isAdmin?: boolean;
}

export function PinnedSection({
    projects,
    onEdit,
    onDelete,
    onTogglePin,
    isAdmin = false
}: PinnedSectionProps) {
    const pinnedProjects = projects.filter((p) => p.pinned);

    if (pinnedProjects.length === 0) return null;

    return (
        <section className="mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3 mb-8 ml-2">
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <Pin size={18} className="text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                        Pinned <span className="text-yellow-500/80">Favorites</span>
                    </h2>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-yellow-500/50 to-transparent mt-1 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pinnedProjects.map((project) => (
                    <ProjectItem
                        key={project.id}
                        project={project}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTogglePin={onTogglePin}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </section>
    );
}
