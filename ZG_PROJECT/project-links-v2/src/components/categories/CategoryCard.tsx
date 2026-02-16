'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Category, Project } from '@/types';
import { ProjectList } from '../projects/ProjectList';
import { GripVertical, Edit2, Trash2, Plus, LayoutGrid } from 'lucide-react';

interface CategoryCardProps {
    category: Category;
    projects: Project[];
    onEdit: (category: Category) => void;
    onDelete: (categoryId: string) => void;
    onAddProject: (categoryId: string) => void;
    onEditProject: (project: Project) => void;
    onDeleteProject: (categoryId: string, projectId: string) => void;
    onTogglePin: (categoryId: string, projectId: string, pinned: boolean) => void;
    isAdmin?: boolean;
}

export function CategoryCard({
    category,
    projects,
    onEdit,
    onDelete,
    onAddProject,
    onEditProject,
    onDeleteProject,
    onTogglePin,
    isAdmin = false
}: CategoryCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: category.id, disabled: !isAdmin });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`glass-card rounded-[32px] overflow-hidden zen-panel flex flex-col h-full group/card transition-all duration-500 hover:shadow-blue-500/5 ${isDragging ? 'z-50 ring-2 ring-blue-500/30' : ''}`}
        >
            {/* Category Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-gray-700 hover:text-gray-400 transition-colors p-1"
                        >
                            <GripVertical size={18} />
                        </button>
                    )}
                    <div className="relative">
                        <h3 className="text-xl font-black text-gradient tracking-tight leading-none group-hover/card:glow-sm transition-all duration-500">
                            {category.name}
                        </h3>
                        <div className="absolute -right-6 -top-1 px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
                            <span className="text-[10px] font-black text-blue-500 leading-none">
                                {projects.length}
                            </span>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Projects List */}
            <div className="p-6 flex-1 flex flex-col">
                <ProjectList
                    categoryId={category.id}
                    projects={projects}
                    onEdit={onEditProject}
                    onDelete={onDeleteProject}
                    onTogglePin={onTogglePin}
                    isAdmin={isAdmin}
                />

                {isAdmin && (
                    <button
                        onClick={() => onAddProject(category.id)}
                        className="group flex items-center justify-center gap-3 mt-8 px-4 py-4 w-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white border border-dashed border-white/5 hover:border-blue-500/30 rounded-2xl transition-all hover:bg-blue-500/2 shadow-inner"
                    >
                        <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>Add Project</span>
                    </button>
                )}
            </div>
        </div>
    );
}
