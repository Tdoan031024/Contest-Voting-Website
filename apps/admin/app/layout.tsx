import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AlertProvider } from './AlertProvider';
import ClientShell from './ClientShell';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
  variable: '--font-sans',
});

export const metadata = {
  title: 'HUIT STARTUP - Đổi mới sáng tạo hướng tới phát triển bền vững',
  description: 'HUIT STARTUP Voting Platform Management Dashboard',
  icons: {
    icon: '/admin/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <link rel="icon" href="/admin/favicon.png" type="image/png" />
      </head>
      <body className={`${inter.className} h-screen overflow-hidden`}>
        <AlertProvider>
          <ClientShell>{children}</ClientShell>
        </AlertProvider>
      </body>
    </html>
  );
}
