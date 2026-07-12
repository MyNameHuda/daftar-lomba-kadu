import { forwardRef, useId } from "react";

export const Input = forwardRef(function Input(
  {
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    hint,
    icon,
    disabled = false,
    required = false,
    autoComplete = "off",
    maxLength,
    min,
    max,
    className = "",
    id: idProp,
  },
  ref
) {
  const autoId = useId();
  const id = idProp ?? `${name ?? "input"}-${autoId}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const inputClasses = [
    "input-base",
    icon ? "pl-10" : "",
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isControlled = value !== undefined;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required ? (
            <span className="text-rose-500 ml-0.5" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative">
        {icon ? (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          min={min}
          max={max}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={inputClasses}
          {...(isControlled ? { value: value ?? "" } : {})}
        />
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
