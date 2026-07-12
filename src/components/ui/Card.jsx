const PADDING_CLASSES = {
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({
  variant = "default",
  padding = "md",
  hoverable = false,
  onClick,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "card-base",
    PADDING_CLASSES[padding] ?? PADDING_CLASSES.md,
    variant === "elevated" ? "shadow-md" : "",
    hoverable ? "hover:shadow-md cursor-pointer" : "",
    onClick ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${classes} text-left w-full`}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
