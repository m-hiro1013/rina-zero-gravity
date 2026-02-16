/**
 * URLからファビコンURLを生成（Google Favicon API使用）
 */
export function getFaviconUrl(url: string, size: number = 32): string {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
    } catch {
        return '';
    }
}
