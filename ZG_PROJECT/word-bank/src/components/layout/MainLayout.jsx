import GlobalSearchBar from './GlobalSearchBar';
import StatusBar from './StatusBar';

export default function MainLayout() {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-primary">
            {/* Header / Global Search */}
            <GlobalSearchBar />

            {/* Main Content Area (3-Column Grid) */}
            <div className="flex-1 grid grid-cols-[260px_1fr_260px] overflow-hidden">

                {/* Left Sidebar */}
                <aside className="bg-sidebar border-r border-border flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border/10">
                        <h2 className="text-text-sidebar font-semibold text-sm uppercase tracking-wider">Explorer</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 text-text-sidebar">
                        {/* TreeView Placeholder */}
                        <div className="p-4 text-center text-text-muted text-sm italic">
                            Category Tree will be here
                        </div>
                    </div>
                </aside>

                {/* Center Editor Area */}
                <main className="bg-editor flex flex-col overflow-hidden relative">
                    {/* Tab Bar Placeholder */}
                    <div className="h-9 bg-tab-inactive border-b border-border flex items-center px-1 gap-1">
                        <div className="px-3 py-1.5 bg-tab-active border-t-2 border-accent text-xs font-medium text-text-primary flex items-center gap-2 rounded-t-sm shadow-sm">
                            <span>New Prompt</span>
                            <button className="hover:text-danger rounded-full p-0.5">×</button>
                        </div>
                        <button className="w-6 h-6 flex items-center justify-center hover:bg-hover rounded text-text-muted">+</button>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-3xl mx-auto text-center space-y-4 pt-20">
                            <h1 className="text-3xl font-bold text-text-primary">Word-Bank</h1>
                            <p className="text-text-muted">Select a prompt from the sidebar or create a new one.</p>
                            <button className="px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors shadow-sm">
                                + Create New Prompt
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (Future Use) */}
                <aside className="bg-sidebar border-l border-border flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border/10">
                        <h2 className="text-text-sidebar font-semibold text-sm uppercase tracking-wider">Tools</h2>
                    </div>
                    <div className="flex-1 p-4 text-text-muted text-sm text-center italic">
                        (Reserved for future expansion)
                    </div>
                </aside>

            </div>

            {/* Status Bar */}
            <StatusBar />
        </div>
    );
}
