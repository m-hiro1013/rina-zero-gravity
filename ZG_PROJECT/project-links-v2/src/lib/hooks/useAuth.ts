'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { subscribeAuth, signIn, signOut } from '@/lib/firebase/auth';

export function useAuth() {
    const { auth, setAuth } = useStore();

    useEffect(() => {
        console.log('useAuth useEffect running...');

        const unsubscribe = subscribeAuth((user, isAllowed) => {
            console.log('Auth callback received:', { user: user?.uid, isAllowed });
            setAuth({
                user,
                loading: false,
                isAllowed
            });
        });

        return () => {
            console.log('useAuth useEffect cleanup');
            unsubscribe();
        };
    }, [setAuth]);

    return {
        user: auth.user,
        loading: auth.loading,
        isAllowed: auth.isAllowed,
        signIn,
        signOut
    };
}
