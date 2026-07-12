import { createContext, useCallback, useMemo, useState } from "react";
import { generateId } from "@/utils/id";
import { TOAST } from "@/constants";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type, message, options = {}) => {
      const id = generateId();
      const toast = {
        id,
        type,
        message,
        duration: options.duration ?? TOAST.DURATION_MS,
      };
      setToasts((prev) => {
        const next = [...prev, toast];
        return next.length > TOAST.MAX_VISIBLE ? next.slice(-TOAST.MAX_VISIBLE) : next;
      });
      if (toast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration);
      }
      return id;
    },
    []
  );

  const api = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      success: (message, options) => showToast("success", message, options),
      error: (message, options) => showToast("error", message, options),
      info: (message, options) => showToast("info", message, options),
      warning: (message, options) => showToast("warning", message, options),
    }),
    [toasts, showToast, dismissToast]
  );

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}
