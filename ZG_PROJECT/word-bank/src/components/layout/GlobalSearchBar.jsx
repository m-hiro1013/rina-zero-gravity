export default function GlobalSearchBar() {
    return (
        <div className="h-12 border-b border-border bg-sidebar flex items-center px-4 gap-2 select-none">
            <div className="text-text-sidebar font-bold text-xl mr-4 flex items-center gap-2">
                <span>Word-Bank</span>
            </div>

            <div className="relative flex-1 max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search prompts... (Ctrl+P)"
                    className="block w-full pl-10 pr-3 py-1.5 border border-transparent rounded-md leading-5 bg-primary text-text-primary placeholder-text-muted focus:outline-none focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm transition-colors"
                    disabled
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-text-muted text-xs border border-border rounded px-1.5 py-0.5">Ctrl+P</span>
                </div>
            </div>

            <div className="w-[100px] flex justify-end">
                {/* User Icon placeholder */}
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    U
                </div>
            </div>
        </div>
    );
}
