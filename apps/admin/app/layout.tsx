import React from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { AlertProvider } from './AlertProvider';
import ClientShell from './ClientShell';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
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
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <link rel="icon" href="/admin/favicon.png" type="image/png" />
      </head>
      <body className={`${beVietnamPro.className} h-screen overflow-hidden`}>
        <AlertProvider>
          <ClientShell>{children}</ClientShell>
        </AlertProvider>
      </body>
    </html>
  );
}
