import React from 'react';
import './globals.css';
import { AlertProvider } from './AlertProvider';
import ClientShell from './ClientShell';

export const metadata = {
  title: 'HUIT STARTUP - Đổi mới sáng tạo hướng tới phát triển bền vững',
  description: 'HUIT STARTUP Voting Platform Management Dashboard',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="h-screen overflow-hidden">
        <AlertProvider>
          <ClientShell>{children}</ClientShell>
        </AlertProvider>
      </body>
    </html>
  );
}
