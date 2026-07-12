import { useCallback, useContext } from "react";
import { ConfirmContext } from "@/context/ConfirmContext";

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }

  const confirm = useCallback(
    (options) => {
      return new Promise((resolve) => {
        ctx.showConfirm({
          ...options,
          onConfirm: () => {
            options.onConfirm?.();
            resolve(true);
          },
          onCancel: () => {
            options.onCancel?.();
            resolve(false);
          },
        });
      });
    },
    [ctx]
  );

  return confirm;
}
