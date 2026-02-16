'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '@/types';
import {
    GripVertical,
    ExternalLink,
    Pin,
    Edit2,
    Trash2,
    ChevronDown,
    Link2,
    Globe
} from 'lucide-react';
import { useState } from 'react';

interface ProjectItemProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (categoryId: string, projectId: string) => void;
    onTogglePin: (categoryId: string, projectId: string, pinned: boolean) => void;
    isAdmin?: boolean;
}

export function ProjectItem({
    project,
    onEdit,
    onDelete,
    onTogglePin,
    isAdmin = false
}: ProjectItemProps) {
    const [showLinks, setShowLinks] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: project.id, disabled: !isAdmin });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        interactive-float group relative rounded-2xl border transition-all duration-500
        ${project.pinned
                    ? 'bg-yellow-500/[0.03] border-yellow-500/20 shadow-lg shadow-yellow-500/5'
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }
        ${isDragging ? 'z-50 shadow-2xl scale-105 border-blue-500/40' : ''}
      `}
        >
            <div className="flex items-center gap-4 px-4 py-3">
                {/* Drag Handle */}
                {isAdmin && (
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-gray-700 hover:text-gray-400 transition-colors"
                    >
                        <GripVertical size={16} />
                    </button>
                )}

                {/* Minimalist Icon Replacement */}
                <div className="p-2 bg-white/[0.03] rounded-lg text-gray-600 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all duration-300">
                    <Globe size={16} />
                </div>

                {/* Info */}
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0"
                >
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                            {project.name}
                        </span>
                        <ExternalLink size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                </a>

                <div className="flex items-center gap-1.5">
                    {/* Related Links Toggle */}
                    {project.links.length > 0 && (
                        <button
                            onClick={() => setShowLinks(!showLinks)}
                            className={`
                p-1.5 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all
                ${showLinks ? 'rotate-180 bg-white/5 text-white' : ''}
              `}
                            title="Related Links"
                        >
                            <ChevronDown size={14} />
                        </button>
                    )}

                    {/* Pin Button */}
                    <button
                        onClick={() => onTogglePin(project.categoryId, project.id, !project.pinned)}
                        className={`
              p-1.5 rounded-lg transition-all
              ${project.pinned
                                ? 'text-yellow-500 bg-yellow-500/10 shadow-inner'
                                : 'text-gray-700 hover:text-yellow-500 hover:bg-white/5'
                            }
            `}
                        title={project.pinned ? 'Unpin' : 'Pin to top'}
                    >
                        <Pin size={14} className={project.pinned ? 'fill-current' : ''} />
                    </button>

                    {/* Admin Tools */}
                    {isAdmin && (
                        <>
                            <div className="w-px h-4 bg-white/5 mx-1" />
                            <button
                                onClick={() => onEdit(project)}
                                className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-400/5 rounded-lg transition-all"
                            >
                                <Edit2 size={13} />
                            </button>
                            <button
                                onClick={() => onDelete(project.categoryId, project.id)}
                                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                            >
                                <Trash2 size={13} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Sub-links Expansion */}
            {showLinks && project.links.length > 0 && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all active:scale-95"
                            >
                                <Link2 size={10} className="text-gray-600" />
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
