// =====================================================
// RequireAuth — guard admin-only routes
// =====================================================

import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export function RequireAuth({ children }) {
  const { isAuthed, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace state={{ from: location }} />;
  }

  return children;
}
