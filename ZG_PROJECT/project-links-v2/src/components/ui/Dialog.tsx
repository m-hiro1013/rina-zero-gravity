'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div
                className="fixed inset-0 bg-gray-950/40 backdrop-blur-md cursor-pointer"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
                    <h2 className="text-lg font-bold text-gradient tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
