export default function StatusBar() {
    return (
        <div className="h-8 bg-accent text-white flex items-center justify-between px-4 text-xs select-none">
            <div className="flex items-center gap-4">
                <span>0 prompts</span>
            </div>
            <div className="flex items-center gap-4">
                <span>Ready</span>
            </div>
        </div>
    );
}
