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
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    title: string;
    type: AlertType;
    resolve: (val: boolean) => void;
  } | null>(null);

  const showConfirm = useCallback((
    message: string,
    title = 'Xác nhận',
    type: AlertType = 'warning'
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirmConfig({ message, title, type, resolve });
    });
  }, []);

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
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
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
            className="toast-item pointer-events-auto relative overflow-hidden flex items-start gap-3 rounded-xl border border-[#DDE5EC] bg-white p-4 shadow-lg transition-all duration-300 w-full"
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
                <svg className="h-5 w-5 text-[#005BAA]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.083.985l-.5 1.5a.75.75 0 0 0 .902.952l.05-.01a.75.75 0 1 0-.215-1.482l.092-.276a1.5 1.5 0 0 0-2.183-1.78l-.04.02a.75.75 0 1 0 .74 1.307Z" />
                  <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
                </svg>
              )}
            </div>
 
            {/* Text details */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-[13px] font-bold text-[#102A43] tracking-wide uppercase font-heading">{toast.title}</h4>
              <p className="text-[11px] text-[#64748B] mt-1 leading-normal font-semibold whitespace-pre-line">{toast.message}</p>
            </div>
 
            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-[#64748B] hover:text-[#102A43] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
 
            {/* Animated Bottom Timer Bar */}
            <div 
              className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#003F7D] to-[#005BAA]" 
              style={{ animation: 'shrinkWidth 4s linear forwards' }} 
            />
          </div>
        ))}
      </div>
 
      {confirmConfig && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[4px] transition-all duration-300">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scaleUpConfirm {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .confirm-modal {
              animation: scaleUpConfirm 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />
          <div className="confirm-modal w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                confirmConfig.type === 'error' ? 'bg-rose-50 text-rose-600' :
                confirmConfig.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                confirmConfig.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {confirmConfig.type === 'success' && (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
                {confirmConfig.type === 'error' && (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                )}
                {(confirmConfig.type === 'warning' || confirmConfig.type === 'info') && (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-[#102A43] tracking-wide uppercase">{confirmConfig.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 font-bold whitespace-pre-line">{confirmConfig.message}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  confirmConfig.resolve(false);
                  setConfirmConfig(null);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#52605b] hover:bg-slate-50 transition active:scale-[0.98]"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmConfig.resolve(true);
                  setConfirmConfig(null);
                }}
                className={`rounded-lg px-4 py-2 text-xs font-bold text-white shadow transition active:scale-[0.98] ${
                  confirmConfig.type === 'error' ? 'bg-rose-600 hover:bg-rose-700' :
                  confirmConfig.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  confirmConfig.type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
                  'bg-[#005BAA] hover:bg-[#003F7D]'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
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
