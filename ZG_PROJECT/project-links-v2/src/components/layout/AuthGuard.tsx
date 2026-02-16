'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading, isAllowed } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isAllowed)) {
            router.push('/login');
        }
    }, [user, loading, isAllowed, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-gray-400">読み込み中...</div>
            </div>
        );
    }

    if (!user || !isAllowed) {
        return null;
    }

    return <>{children}</>;
}
