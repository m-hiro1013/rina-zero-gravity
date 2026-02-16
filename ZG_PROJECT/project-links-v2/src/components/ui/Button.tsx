'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] outline-none';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30',
        secondary: 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-100 border border-white/10 backdrop-blur-md hover:border-white/20',
        danger: 'bg-red-600/80 hover:bg-red-500/80 text-white border border-red-500/20 shadow-lg shadow-red-900/20',
        ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',
        glass: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl'
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-xs tracking-wider uppercase',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}
