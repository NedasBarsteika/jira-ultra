import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import Footer from '@/components/layout/footer/Footer';
import Navbar from '@/components/layout/navbar/Navbar';
import MuiProvider from '@/components/providers/MuiProvider';
import ToastProvider from '@/components/utils/toast/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://iterova.com'),
  title: 'Iterova - AI-Powered Work Planning for Advanced Teams',
  description:
    'Iterova is a work planning system that helps teams automate and plan tasks in sprints based on real capacity, track progress, and close the gap between planned and completed work. With backlog management, board views, and team metrics, Iterova turns plans into measurable progress.',
  keywords:
    'work planning, sprint management, task management, iteration planning, team capacity, backlog, agile, project management, iterova',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Iterova - AI-Powered Work Planning for Advanced Teams',
    description:
      'Plan tasks in sprints based on real team capacity. Track progress, manage backlogs, and improve planning accuracy.',
    url: 'https://iterova.com',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Iterova - Turning plans into progress',
      },
    ],
    type: 'website',
    locale: 'en_US',
    siteName: 'Iterova',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MuiProvider>
          <ToastProvider>
            <Navbar />
            {children}
            <Footer />
          </ToastProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
