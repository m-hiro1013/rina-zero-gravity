import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project Links Dashboard v2',
  description: 'Self-hosted personal project dashboard',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen selection:bg-blue-500/30`}>
        {children}
      </body>
    </html>
  );
}
