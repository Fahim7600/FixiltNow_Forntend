import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/lib/providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FixItNow | On-Demand Home Services Marketplace',
  description: 'Connect with verified, top-tier technicians for plumbing, electrical, HVAC, and home repairs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} scroll-smooth dark`}>
      <body className="min-h-screen flex flex-col bg-[#12100e] text-[#f5f2eb] antialiased selection:bg-[#f59e0b]/30 selection:text-[#fbbf24]">
        <Providers>
          <Toaster position="top-right" theme="dark" richColors />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
