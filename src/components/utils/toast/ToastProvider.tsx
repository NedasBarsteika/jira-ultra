'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { createContext, useCallback, useContext, useState } from 'react';

type Severity = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  severity?: Severity;
  duration?: number;
}

export interface ToastContextValue {
  show: (message: string, options?: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: Severity;
  duration: number;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
    duration: 3500,
  });

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    setToast({
      open: true,
      message,
      severity: options.severity ?? 'info',
      duration: options.duration ?? 3500,
    });
  }, []);

  const success = useCallback(
    (message: string, duration = 3500) => show(message, { severity: 'success', duration }),
    [show]
  );
  const error = useCallback(
    (message: string, duration = 4000) => show(message, { severity: 'error', duration }),
    [show]
  );
  const warning = useCallback(
    (message: string, duration = 3500) => show(message, { severity: 'warning', duration }),
    [show]
  );
  const info = useCallback(
    (message: string, duration = 3500) => show(message, { severity: 'info', duration }),
    [show]
  );

  const handleClose = () => setToast(t => ({ ...t, open: false }));

  return (
    <ToastContext.Provider value={{ show, success, error, warning, info }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={handleClose}
          sx={{ minWidth: 300 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
