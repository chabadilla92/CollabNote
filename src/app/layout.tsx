// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import SupabaseProvider from '@/providers/SupabaseProvider.tsx';

export const metadata: Metadata = {
  title: 'CollabNote',
  description: 'Collaborative text editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* eslint-disable @next/next/no-page-custom-font */

  return (
    <html lang='en'>
      <head>
        {/* Load Ubuntu font from Google Fonts */}
        <link
          href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='font-ubuntu h-[100dvh] bg-white'>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
