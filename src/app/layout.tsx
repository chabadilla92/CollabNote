// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import SupabaseProvider from '@/providers/SupabaseProvider';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CollabNote',
  description: 'Collaborative text editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${ubuntu.className} h-[100dvh] bg-white`}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
