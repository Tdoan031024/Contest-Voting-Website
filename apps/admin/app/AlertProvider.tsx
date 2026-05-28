'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: AlertType;
  title: string;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, title?: string) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showAlert = useCallback((message: string, type: AlertType = 'info', title?: string): Promise<boolean> => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const defaultTitle = type === 'success' ? 'Thành công' :
                         type === 'error' ? 'Có lỗi xảy ra' :
                         type === 'warning' ? 'Cảnh báo' : 'Thông báo';
    
    setToasts((prev) => [...prev, { id, message, type, title: title || defaultTitle }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
    
    return new Promise<boolean>((resolve) => {
      // Resolve after 1.5 seconds so redirects (like login) let the toast be seen
      setTimeout(() => resolve(true), 1500);
    });
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;

      window.alert = (message: any) => {
        let type: AlertType = 'info';
        let title = 'Thông báo';
        const msgStr = String(message).toLowerCase();

        if (msgStr.includes('thành công') || msgStr.includes('success')) {
          type = 'success';
          title = 'Thành công';
        } else if (msgStr.includes('thất bại') || msgStr.includes('lỗi') || msgStr.includes('failed') || msgStr.includes('error')) {
          type = 'error';
          title = 'Có lỗi xảy ra';
        } else if (msgStr.includes('cảnh báo') || msgStr.includes('warning') || msgStr.includes('chú ý')) {
          type = 'warning';
          title = 'Cảnh báo';
        }

        showAlert(String(message), type, title);
      };

      return () => {
        window.alert = originalAlert;
      };
    }
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* Toast List Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-[350px] pointer-events-none">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shrinkWidth {
            from { width: 100%; }
            to { width: 0%; }
          }
          @keyframes toastSlideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .toast-item {
            animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />
        
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="toast-item pointer-events-auto relative overflow-hidden flex items-start gap-3 rounded-xl border border-[#dce5e1] bg-white p-4 shadow-lg transition-all duration-300 w-full"
          >
            {/* Icon */}
            <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7f6]">
              {toast.type === 'success' && (
                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.083.985l-.5 1.5a.75.75 0 0 0 .902.952l.05-.01a.75.75 0 1 0-.215-1.482l.092-.276a1.5 1.5 0 0 0-2.183-1.78l-.04.02a.75.75 0 1 0 .74 1.307Z" />
                  <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
                </svg>
              )}
            </div>

            {/* Text details */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-[13px] font-bold text-[#123c34] tracking-wide uppercase font-heading">{toast.title}</h4>
              <p className="text-[11px] text-[#52605b] mt-1 leading-normal font-semibold whitespace-pre-line">{toast.message}</p>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-[#8aa098] hover:text-[#123c34] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Animated Bottom Timer Bar */}
            <div 
              className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#123c34] to-[#0f766e]" 
              style={{ animation: 'shrinkWidth 4s linear forwards' }} 
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
