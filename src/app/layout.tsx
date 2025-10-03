
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "../components/ui/toaster";
import { cn } from '../lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'FleetTrack',
  description: 'Vehicle & Fleet Tracker by Nobi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <div className="h-2.5 bg-foreground" />
        {children}
        <footer className="fixed bottom-4 left-4">
          <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
            N
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
