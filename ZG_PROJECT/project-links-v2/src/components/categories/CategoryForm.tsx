'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CategoryFormProps {
    initialName?: string;
    onSubmit: (name: string) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
}

export function CategoryForm({
    initialName = '',
    onSubmit,
    onCancel,
    submitLabel = '保存'
}: CategoryFormProps) {
    const [name, setName] = useState(initialName);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(name.trim());
        } catch (error) {
            console.error('Category submit error:', error);
            alert('エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl">
            <div className="flex-1">
                <Input
                    label="カテゴリ名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: メインプロジェクト"
                    autoFocus
                />
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    キャンセル
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
