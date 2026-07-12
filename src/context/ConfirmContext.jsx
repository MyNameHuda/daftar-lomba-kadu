import { createContext, useCallback, useMemo, useState } from "react";

export const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
  title: "Konfirmasi",
  message: "Apakah Anda yakin?",
  confirmText: "Ya",
  cancelText: "Batal",
  variant: "primary",
  onConfirm: null,
  onCancel: null,
};

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    ...DEFAULT_OPTIONS,
  });

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showConfirm = useCallback((options) => {
    setConfirmState({
      isOpen: true,
      ...DEFAULT_OPTIONS,
      ...options,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.onConfirm?.();
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    confirmState.onCancel?.();
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  const api = useMemo(
    () => ({
      ...confirmState,
      showConfirm,
      closeConfirm,
      handleConfirm,
      handleCancel,
    }),
    [confirmState, showConfirm, closeConfirm, handleConfirm, handleCancel]
  );

  return <ConfirmContext.Provider value={api}>{children}</ConfirmContext.Provider>;
}
