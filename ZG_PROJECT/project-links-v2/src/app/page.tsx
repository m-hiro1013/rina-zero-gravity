'use client';

import { useEffect } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/tabs/TabBar';
import { PinnedSection } from '@/components/pinned/PinnedSection';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { getCategories } from '@/lib/firebase/categories';
import { getAllProjects, toggleProjectPin } from '@/lib/firebase/projects';
import { getTabs } from '@/lib/firebase/tabs';
import { Loader2, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';

export default function HomePage() {
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

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const getFilteredData = () => {
    if (!activeTab || activeTab.isDefault || activeTab.items.length === 0) {
      return { categories, projectsByCategory };
    }

    const filteredCategories = categories.filter((cat) =>
      activeTab.items.some((item) => item.categoryId === cat.id)
    );

    const filteredProjectsMap: Record<string, Project[]> = {};
    filteredCategories.forEach((cat) => {
      const allCatProjects = projectsByCategory[cat.id] || [];
      const isCategorySelected = activeTab.items.some(
        (item) => item.type === 'category' && item.categoryId === cat.id
      );

      if (isCategorySelected) {
        filteredProjectsMap[cat.id] = allCatProjects;
      } else {
        filteredProjectsMap[cat.id] = allCatProjects.filter((p) =>
          activeTab.items.some(
            (item) => item.type === 'project' && item.projectId === p.id
          )
        );
      }
    });

    const finalCategories = filteredCategories.filter(
      (cat) => (filteredProjectsMap[cat.id]?.length || 0) > 0
    );

    return {
      categories: finalCategories,
      projectsByCategory: filteredProjectsMap
    };
  };

  const { categories: displayCategories, projectsByCategory: displayProjects } = getFilteredData();
  const allProjects = Object.values(projectsByCategory).flat();

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
      alert('操作に失敗しました');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-transparent pb-32 relative overflow-hidden">
        {/* Zen Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />

        <Header />
        <div className="h-40" /> {/* Spacer for floating header */}
        <TabBar />

        <main className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative" />
              </div>
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing</p>
            </div>
          ) : (
            <div className="space-y-16">
              <PinnedSection
                projects={allProjects}
                onEdit={() => { }}
                onDelete={() => { }}
                onTogglePin={handleTogglePin}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {displayCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    projects={displayProjects[category.id] || []}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    onAddProject={() => { }}
                    onEditProject={() => { }}
                    onDeleteProject={() => { }}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>

              {displayCategories.length === 0 && (
                <div className="text-center py-32 glass-card rounded-[40px] border-dashed border-white/5 mx-4">
                  <div className="inline-flex p-4 bg-gray-900 border border-white/5 rounded-3xl mb-6 shadow-xl">
                    <LayoutGrid size={40} className="text-gray-700" />
                  </div>
                  <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Awaiting Content</h3>
                  <p className="text-sm text-gray-600 mt-3 mb-10 max-w-xs mx-auto leading-relaxed">
                    This filter layer currently contains no entities. Manage your architecture in the Admin Portal.
                  </p>
                  <Link href="/admin">
                    <Button variant="glass" size="lg" className="px-10">
                      Go to Admin
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-40 mb-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em] opacity-30">
              Zero_Gravity Dashboard v2.0 • 2026
            </p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
