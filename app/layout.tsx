import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://agentic-a6901e09.vercel.app'),
  title: {
    default: 'YouTube Shorts Viewer',
    template: '%s ? Shorts Viewer',
  },
  description: 'Paste any YouTube link to watch it cleanly as an embed.',
  openGraph: {
    title: 'YouTube Shorts Viewer',
    description: 'Paste any YouTube link to watch it cleanly as an embed.',
    url: 'https://agentic-a6901e09.vercel.app',
    siteName: 'Shorts Viewer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Shorts Viewer',
    description: 'Paste any YouTube link to watch it cleanly as an embed.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
