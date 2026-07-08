import React from 'react';
import localFont from 'next/font/local';
import './globals.css';
import { AlertProvider } from './AlertProvider';
import ClientShell from './ClientShell';

const inter = localFont({
  src: [
    { path: '../public/fonts/inter-v13-vietnamese-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/inter-v13-vietnamese-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/inter-v13-vietnamese-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/inter-v13-vietnamese-700.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/inter-v13-vietnamese-800.woff2', weight: '800', style: 'normal' },
    { path: '../public/fonts/inter-v13-vietnamese-900.woff2', weight: '900', style: 'normal' },
  ],
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
