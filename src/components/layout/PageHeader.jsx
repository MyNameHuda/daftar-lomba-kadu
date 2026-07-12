import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PageHeader({ title, subtitle, backTo, actions }) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (typeof backTo === "string") navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="mb-6 md:mb-8 animate-fadeIn">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 min-w-0">
          {backTo !== null ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              icon={<ArrowLeft className="h-4 w-4" />}
              aria-label="Kembali"
              className="-ml-2 shrink-0"
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex gap-2 shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
