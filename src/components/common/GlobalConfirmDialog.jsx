import { useContext } from "react";
import { ConfirmContext } from "@/context/ConfirmContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function GlobalConfirmDialog() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) return null;

  return (
    <ConfirmDialog
      isOpen={ctx.isOpen}
      onClose={ctx.handleCancel}
      onConfirm={ctx.handleConfirm}
      title={ctx.title}
      message={ctx.message}
      confirmText={ctx.confirmText}
      cancelText={ctx.cancelText}
      variant={ctx.variant}
    />
  );
}
