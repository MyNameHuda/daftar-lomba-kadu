import { useToast } from "@/hooks/useToast";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const TYPE_STYLES = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    icon: "text-emerald-500",
    Icon: CheckCircle2,
  },
  error: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-900",
    icon: "text-rose-500",
    Icon: AlertCircle,
  },
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-900",
    icon: "text-sky-500",
    Icon: Info,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    icon: "text-amber-500",
    Icon: AlertTriangle,
  },
};

function ToastItem({ toast, onDismiss }) {
  const style = TYPE_STYLES[toast.type] ?? TYPE_STYLES.info;
  const Icon = style.Icon;

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 min-w-[260px] max-w-sm px-4 py-3 rounded-xl border shadow-md ${style.bg} ${style.border} animate-slideInRight`}
    >
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${style.icon}`} aria-hidden="true" />
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className={`shrink-0 p-0.5 rounded hover:bg-black/5 ${style.text}`}
        aria-label="Tutup notifikasi"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto z-[60] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}
