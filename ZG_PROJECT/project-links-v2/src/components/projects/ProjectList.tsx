'use client';

import {
    DndContext,
    closestCenter,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Project } from '@/types';
import { ProjectItem } from './ProjectItem';
import { reorderProjects } from '@/lib/firebase/projects';
import { useStore } from '@/store/useStore';

interface ProjectListProps {
    categoryId: string;
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (categoryId: string, projectId: string) => void;
    onTogglePin: (categoryId: string, projectId: string, pinned: boolean) => void;
    isAdmin?: boolean;
}

export function ProjectList({
    categoryId,
    projects,
    onEdit,
    onDelete,
    onTogglePin,
    isAdmin = false
}: ProjectListProps) {
    const { projectsByCategory, setProjectsByCategory } = useStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = projects.findIndex((p) => p.id === active.id);
        const newIndex = projects.findIndex((p) => p.id === over.id);

        const newProjects = arrayMove(projects, oldIndex, newIndex);

        // ローカル状態更新
        setProjectsByCategory({
            ...projectsByCategory,
            [categoryId]: newProjects
        });

        // Firestoreに保存
        await reorderProjects(categoryId, newProjects.map(p => p.id));
    };

    if (projects.length === 0 && !isAdmin) {
        return (
            <div className="text-center py-4 text-sm text-gray-500 italic">
                プロジェクトがありません
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={projects.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {projects.map((project) => (
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
            </SortableContext>
        </DndContext>
    );
}
