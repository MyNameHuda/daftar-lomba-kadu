import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  primary:
    "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm hover:from-brand-700 hover:to-brand-600 hover:shadow-md active:scale-[0.98]",
  secondary:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]",
  danger:
    "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-sm hover:from-rose-700 hover:to-rose-600 hover:shadow-md active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.98]",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconRight,
  type = "button",
  onClick,
  className = "",
  children,
  ...rest
}) {
  const isDisabled = disabled || loading;
  const classes = [
    "btn-base",
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children ? <span>{children}</span> : null}
      {!loading && iconRight ? (
        <span className="shrink-0">{iconRight}</span>
      ) : null}
    </button>
  );
}
