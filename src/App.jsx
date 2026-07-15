import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RequireAuth } from "@/components/common/RequireAuth";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ContestDetailPage = lazy(() => import("@/pages/ContestDetailPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminContestFormPage = lazy(() => import("@/pages/AdminContestFormPage"));
const AdminParticipantsPage = lazy(() => import("@/pages/AdminParticipantsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}

function ScrollToTop() {
  useLocation();
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public layout (with header) */}
        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.HOME}
            element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.CONTEST_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <ContestDetailPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>

        {/* Login (own layout, no header) */}
        <Route
          path={ROUTES.ADMIN_LOGIN}
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          }
        />

        {/* Admin (own layout, requires auth) */}
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminDashboardPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.ADMIN_CONTEST_NEW}
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminContestFormPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.ADMIN_CONTEST_EDIT}
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminContestFormPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/lomba/:id/peserta"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminParticipantsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
