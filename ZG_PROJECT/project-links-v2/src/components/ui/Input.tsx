'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="space-y-2 group">
            {label && (
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm transition-all duration-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-500/10 backdrop-blur-sm ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    );
}
