'use client';

import { LogIn, Settings, LogOut, Hexagon, Layout } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
    const { user, signIn, signOut } = useAuth();
    const pathname = usePathname();
    const isCurrentlyAdmin = pathname === '/admin';

    return (
        <header className="fixed top-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
            <div className="w-full max-w-5xl glass-morphism rounded-3xl px-8 py-3 flex items-center justify-between shadow-2xl pointer-events-auto">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/20">
                        <Hexagon size={20} className="text-white fill-white" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-black tracking-tighter text-gradient leading-none">
                            ZERO_GRAVITY
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.25em] mt-0.5 opacity-60">
                            Project Dashboard
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <Link
                                href={isCurrentlyAdmin ? '/' : '/admin'}
                                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 flex items-center gap-2"
                                title={isCurrentlyAdmin ? 'Dashboard' : 'Admin'}
                            >
                                {isCurrentlyAdmin ? <Layout size={20} /> : <Settings size={20} />}
                                <span className="text-xs font-bold hidden md:inline uppercase tracking-widest">
                                    {isCurrentlyAdmin ? 'Home' : 'Admin'}
                                </span>
                            </Link>
                            <div className="w-px h-6 bg-white/5 mx-1" />
                            <button
                                onClick={() => signOut()}
                                className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-300"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-95 text-white"
                        >
                            <LogIn size={16} />
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
