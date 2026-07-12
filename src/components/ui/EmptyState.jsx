export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon ? (
        <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          {icon}
        </div>
      ) : null}
      {title ? (
        <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      ) : null}
      {description ? (
        <p className="text-sm text-slate-500 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
