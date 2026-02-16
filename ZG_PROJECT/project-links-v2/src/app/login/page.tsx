'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Hexagon, Lock } from 'lucide-react';

export default function LoginPage() {
    const { user, loading, signIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push('/admin');
        }
    }, [user, loading, router]);

    if (loading) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-950 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
                <div className="glass-card rounded-[40px] p-10 md:p-14 text-center">
                    <div className="inline-flex p-4 bg-blue-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/20 animate-float">
                        <Hexagon size={40} className="text-white fill-white" />
                    </div>

                    <h1 className="text-3xl font-black text-gradient tracking-tighter mb-2">
                        ZERO_GRAVITY
                    </h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em] mb-12 opacity-60">
                        Admin Portal
                    </p>

                    <button
                        onClick={() => signIn()}
                        className="w-full group relative flex items-center justify-center gap-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 rounded-2xl py-5 transition-all duration-300 shadow-xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg"
                            alt="Google"
                            className="w-5 h-5 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-sm font-black uppercase tracking-widest text-white">
                            Sign in with Google
                        </span>
                    </button>

                    <div className="mt-12 flex items-center justify-center gap-2 text-gray-500">
                        <Lock size={14} className="opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                            Secured by Firebase Auth
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
