import type { Metadata } from 'next';
import './globals.css';
import { inter } from '@/libs/fonts';

export const metadata: Metadata = {
  title: 'Zards - Flashcards',
  description: 'Code by @themuuln',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} bg-white text-black dark:bg-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
