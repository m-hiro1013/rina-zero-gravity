'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tab, TabFormData } from '@/types';

interface TabDialogProps {
    isOpen: boolean;
    onClose: () => void;
    tab: Tab | null;
    onSave: (data: TabFormData) => Promise<void>;
}

export function TabDialog({
    isOpen,
    onClose,
    tab,
    onSave
}: TabDialogProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(tab?.name || '');
        }
    }, [isOpen, tab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSave({
                name: name.trim()
            });
            onClose();
        } catch (error) {
            console.error('Tab save error:', error);
            alert('エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={tab ? 'タブを編集' : 'タブを追加'}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="タブ名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: 仕事用, プライベート"
                    required
                    autoFocus
                />

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {tab ? '更新' : '作成'}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
