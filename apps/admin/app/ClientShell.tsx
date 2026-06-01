'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';

type ClientShellProps = {
  children: React.ReactNode;
};

export default function ClientShell({ children }: ClientShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === '/login' || pathname?.startsWith('/login/');

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return <ClientLayout>{children}</ClientLayout>;
}

