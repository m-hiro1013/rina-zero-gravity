'use client';

import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Project, ProjectFormData, ProjectLink } from '@/types';
import { Plus, Trash2, Link } from 'lucide-react';

interface ProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
    onSave: (data: ProjectFormData) => Promise<void>;
}

export function ProjectDialog({
    isOpen,
    onClose,
    project,
    onSave
}: ProjectDialogProps) {
    const [name, setName] = useState(project?.name || '');
    const [url, setUrl] = useState(project?.url || '');
    const [links, setLinks] = useState<ProjectLink[]>(project?.links || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddLink = () => {
        setLinks([...links, { name: '', url: '' }]);
    };

    const handleLinkChange = (index: number, field: keyof ProjectLink, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleRemoveLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !url.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSave({
                name: name.trim(),
                url: url.trim(),
                links: links.filter(l => l.name.trim() && l.url.trim()),
                pinned: project?.pinned
            });
            onClose();
        } catch (error) {
            console.error('Project save error:', error);
            alert('エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={project ? 'プロジェクトを編集' : 'プロジェクトを追加'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="プロジェクト名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: My Portfolio"
                    required
                />
                <Input
                    label="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    required
                />

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">関連リンク</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleAddLink}
                            className="text-blue-400 hover:text-blue-300"
                        >
                            <Plus size={16} /> 追加
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {links.map((link, index) => (
                            <div key={index} className="flex gap-2 items-start bg-gray-900/50 p-2 rounded-lg border border-gray-700">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder="リンク名"
                                        value={link.name}
                                        onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                    <Input
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLink(index)}
                                    className="p-1 text-gray-500 hover:text-red-400"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {links.length === 0 && (
                            <div className="text-center py-4 text-xs text-gray-500 border border-dashed border-gray-700 rounded-lg">
                                関連リンクはありません
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {project ? '更新' : '追加'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
