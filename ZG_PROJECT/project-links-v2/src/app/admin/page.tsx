'use client';

import { useEffect, useState } from 'react';
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

import { AuthGuard } from '@/components/layout/AuthGuard';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/tabs/TabBar';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories } from '@/lib/firebase/categories';
import { getAllProjects, createProject, updateProject, deleteProject, toggleProjectPin, updateProject as firestoreUpdateProject } from '@/lib/firebase/projects';
import {
    getTabs,
    createTab,
    updateTab,
    deleteTab as firestoreDeleteTab,
    reorderTabs,
    updateTabItems
} from '@/lib/firebase/tabs';

import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { PinnedSection } from '@/components/pinned/PinnedSection';
import { TabDialog } from '@/components/tabs/TabDialog';
import { TabItemManager } from '@/components/tabs/TabItemManager';
import { Dialog } from '@/components/ui/Dialog';
import { Category, Project, ProjectFormData, Tab, TabItem } from '@/types';
import { Plus, Loader2, Sparkles, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPage() {
    const {
        categories,
        setCategories,
        projectsByCategory,
        setProjectsByCategory,
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        isLoading,
        setIsLoading
    } = useStore();

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showProjectDialog, setShowProjectDialog] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);

    const [showTabDialog, setShowTabDialog] = useState(false);
    const [editingTab, setEditingTab] = useState<Tab | null>(null);
    const [editingTabForItems, setEditingTabForItems] = useState<Tab | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );

    const { user, loading: authLoading, isAllowed } = useAuth();

    useEffect(() => {
        if (authLoading || !user || !isAllowed) return;

        async function loadData() {
            setIsLoading(true);
            try {
                const [cats, projs, tabList] = await Promise.all([
                    getCategories(),
                    getAllProjects(),
                    getTabs()
                ]);

                setCategories(cats);
                setProjectsByCategory(projs);
                setTabs(tabList);

                const defaultTab = tabList.find((t) => t.isDefault);
                if (defaultTab && !activeTabId) {
                    setActiveTabId(defaultTab.id);
                }
            } catch (error) {
                console.error('Data load error:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [authLoading, user, isAllowed, setCategories, setProjectsByCategory, setTabs, setIsLoading, activeTabId, setActiveTabId]);

    const handleAddCategory = async (name: string) => {
        await createCategory({ name });
        const cats = await getCategories();
        setCategories(cats);
        setShowCategoryForm(false);
    };

    const handleEditCategory = async (name: string) => {
        if (!editingCategory) return;
        await updateCategory(editingCategory.id, { name });
        const cats = await getCategories();
        setCategories(cats);
        setEditingCategory(null);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm('このカテゴリと配下のプロジェクトをすべて削除しますか？')) return;
        try {
            await deleteCategory(categoryId);
            setCategories(categories.filter(c => c.id !== categoryId));
            const newProjects = { ...projectsByCategory };
            delete newProjects[categoryId];
            setProjectsByCategory(newProjects);
        } catch (error) {
            alert('削除に失敗しました');
        }
    };

    const handleCategoryDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = categories.findIndex((c) => c.id === active.id);
        const newIndex = categories.findIndex((c) => c.id === over.id);

        const newCategories = arrayMove(categories, oldIndex, newIndex);
        setCategories(newCategories);

        await reorderCategories(newCategories.map((c) => c.id));
    };

    const handleOpenProjectDialog = (categoryId: string, project?: Project) => {
        setTargetCategoryId(categoryId);
        setEditingProject(project || null);
        setShowProjectDialog(true);
    };

    const handleSaveProject = async (data: ProjectFormData) => {
        if (!targetCategoryId) return;

        try {
            if (editingProject) {
                await updateProject(targetCategoryId, editingProject.id, data);
            } else {
                await createProject(targetCategoryId, data);
            }

            const projs = await getAllProjects();
            setProjectsByCategory(projs);
            setShowProjectDialog(false);
        } catch (error) {
            alert('保存に失敗しました');
        }
    };

    const handleDeleteProject = async (categoryId: string, projectId: string) => {
        if (!confirm('このプロジェクトを削除しますか？')) return;
        try {
            await deleteProject(categoryId, projectId);
            const newProjects = projectsByCategory[categoryId].filter(p => p.id !== projectId);
            setProjectsByCategory({ ...projectsByCategory, [categoryId]: newProjects });
        } catch (error) {
            alert('削除に失敗しました');
        }
    };

    const handleTogglePin = async (
        categoryId: string,
        projectId: string,
        pinned: boolean
    ) => {
        try {
            await toggleProjectPin(categoryId, projectId, pinned);
            const newProjects = { ...projectsByCategory };
            newProjects[categoryId] = newProjects[categoryId].map((p) =>
                p.id === projectId ? { ...p, pinned } : p
            );
            setProjectsByCategory(newProjects);
        } catch (error) {
            alert('ピン留めの切り替えに失敗しました');
        }
    };

    const handleSaveTab = async (data: { name: string }) => {
        try {
            if (editingTab) {
                await updateTab(editingTab.id, data);
            } else {
                await createTab(data);
            }
            const tabList = await getTabs();
            setTabs(tabList);
            setShowTabDialog(false);
            setEditingTab(null);
        } catch (error) {
            alert('保存に失敗しました');
        }
    };

    const handleDeleteTab = async (tabId: string) => {
        if (!confirm('このタブを削除しますか？')) return;
        try {
            await firestoreDeleteTab(tabId);
            setTabs(tabs.filter((t) => t.id !== tabId));
        } catch (error) {
            alert('削除に失敗しました');
        }
    };

    const handleToggleTabItem = async (item: TabItem) => {
        if (!editingTabForItems) return;

        const isSelected = editingTabForItems.items.some(
            (i) =>
                i.categoryId === item.categoryId &&
                (item.projectId ? i.projectId === item.projectId : !i.projectId)
        );

        let newItems: TabItem[];
        if (isSelected) {
            newItems = editingTabForItems.items.filter(
                (i) =>
                    !(
                        i.categoryId === item.categoryId &&
                        (item.projectId ? i.projectId === item.projectId : !i.projectId)
                    )
            );
        } else {
            newItems = [...editingTabForItems.items, item];
        }

        try {
            await updateTabItems(editingTabForItems.id, newItems);
            const updatedTab = { ...editingTabForItems, items: newItems };
            setEditingTabForItems(updatedTab);
            setTabs(tabs.map((t) => (t.id === updatedTab.id ? updatedTab : t)));
        } catch (error) {
            alert('更新に失敗しました');
        }
    };

    const allProjects = Object.values(projectsByCategory).flat();

    return (
        <AuthGuard>
            <div className="min-h-screen bg-transparent pb-32">
                <Header isAdmin />
                <div className="h-40" /> {/* Spacer for floating header */}

                <main className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                                    <ShieldCheck size={24} className="text-blue-500" />
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter">ADMIN <span className="text-blue-500">CONTROL</span></h2>
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs opacity-70 ml-1">
                                Management & Architecture
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {!showCategoryForm && !editingCategory && (
                                <Button
                                    onClick={() => setShowCategoryForm(true)}
                                    className="shadow-2xl shadow-blue-600/20"
                                >
                                    <Plus size={20} /> Add Category
                                </Button>
                            )}
                        </div>
                    </div>

                    {(showCategoryForm || editingCategory) && (
                        <div className="mb-16 animate-in fade-in slide-in-from-top-6 duration-500 px-4">
                            <div className="glass-card p-10 rounded-[40px]">
                                <CategoryForm
                                    initialName={editingCategory?.name || ''}
                                    onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
                                    onCancel={() => {
                                        setShowCategoryForm(false);
                                        setEditingCategory(null);
                                    }}
                                    submitLabel={editingCategory ? 'Update' : 'Create'}
                                />
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative" />
                            </div>
                            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Synchronizing</p>
                        </div>
                    ) : (
                        <div className="space-y-24">
                            <PinnedSection
                                projects={allProjects}
                                onEdit={(project) =>
                                    handleOpenProjectDialog(project.categoryId, project)
                                }
                                onDelete={handleDeleteProject}
                                onTogglePin={handleTogglePin}
                                isAdmin
                            />

                            <section>
                                <div className="flex items-center gap-4 mb-10 ml-4">
                                    <div className="h-px bg-white/5 flex-1" />
                                    <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em]">Structure</h3>
                                    <div className="h-px bg-white/5 flex-1" />
                                </div>

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleCategoryDragEnd}
                                >
                                    <SortableContext
                                        items={categories.map((c) => c.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {categories.map((category) => (
                                                <CategoryCard
                                                    key={category.id}
                                                    category={category}
                                                    projects={projectsByCategory[category.id] || []}
                                                    onEdit={setEditingCategory}
                                                    onDelete={handleDeleteCategory}
                                                    onAddProject={handleOpenProjectDialog}
                                                    onEditProject={(project) =>
                                                        handleOpenProjectDialog(category.id, project)
                                                    }
                                                    onDeleteProject={handleDeleteProject}
                                                    onTogglePin={handleTogglePin}
                                                    isAdmin
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </section>

                            <section className="pt-20">
                                <div className="flex items-center justify-between mb-12 px-4">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black text-white tracking-tight italic">TABS_SYSTEM</h2>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Display Filtering Architecture</p>
                                    </div>
                                    <Button
                                        onClick={() => setShowTabDialog(true)}
                                        variant="glass"
                                        size="sm"
                                    >
                                        <Plus size={18} /> New Tab
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tabs.map((tab) => (
                                        <div
                                            key={tab.id}
                                            className="glass-card p-6 rounded-[28px] flex items-center justify-between hover:bg-white/[0.04] transition-all group border-white/5 hover:border-white/10"
                                        >
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => !tab.isDefault && setEditingTabForItems(tab)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{tab.name}</span>
                                                    {tab.isDefault && (
                                                        <span className="text-[9px] font-black bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-widest">Master</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase tracking-widest">
                                                    {tab.isDefault ? 'All entities' : `${tab.items.length} units assigned`}
                                                </p>
                                            </div>

                                            {!tab.isDefault && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTab(tab);
                                                            setShowTabDialog(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTab(tab.id)}
                                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </main>

                <ProjectDialog
                    isOpen={showProjectDialog}
                    project={editingProject}
                    onClose={() => {
                        setShowProjectDialog(false);
                        setEditingProject(null);
                        setTargetCategoryId(null);
                    }}
                    onSave={handleSaveProject}
                />

                <TabDialog
                    isOpen={showTabDialog}
                    tab={editingTab}
                    onClose={() => {
                        setShowTabDialog(false);
                        setEditingTab(null);
                    }}
                    onSave={handleSaveTab}
                />

                {editingTabForItems && (
                    <Dialog
                        isOpen={!!editingTabForItems}
                        onClose={() => setEditingTabForItems(null)}
                        title={`Configuring ${editingTabForItems.name}`}
                    >
                        <div className="space-y-8">
                            <p className="text-sm font-medium text-gray-400 leading-relaxed">
                                Assign categories and projects to this filter layer. This will update the display architecture in real-time. ✨
                            </p>
                            <TabItemManager
                                tab={editingTabForItems}
                                categories={categories}
                                projectsByCategory={projectsByCategory}
                                onToggleItem={handleToggleTabItem}
                            />
                            <div className="flex justify-end pt-4">
                                <Button variant="glass" onClick={() => setEditingTabForItems(null)}>
                                    Close Settings
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </AuthGuard>
    );
}
