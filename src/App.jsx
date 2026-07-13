import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteGuard } from "@/components/common/RouteGuard";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";

const HomePage = lazy(() => import("@/pages/HomePage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const SubCategoryPage = lazy(() => import("@/pages/SubCategoryPage"));
const ParticipantsPage = lazy(() => import("@/pages/ParticipantsPage"));
const ResultPage = lazy(() => import("@/pages/ResultPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
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
          path={ROUTES.CATEGORY}
          element={
            <>
              <RouteGuard require={["contestName"]} redirectTo={ROUTES.HOME} />
              <Suspense fallback={<PageLoader />}>
                <CategoryPage />
              </Suspense>
            </>
          }
        />

        <Route
          path={ROUTES.SUB_CATEGORY}
          element={
            <>
              <RouteGuard
                require={["contestName", "category"]}
                redirectTo={ROUTES.HOME}
              />
              <Suspense fallback={<PageLoader />}>
                <SubCategoryPage />
              </Suspense>
            </>
          }
        />

        <Route
          path={ROUTES.PARTICIPANTS}
          element={
            <>
              <RouteGuard
                require={["contestName", "category", "subCategory"]}
                redirectTo={ROUTES.HOME}
              />
              <Suspense fallback={<PageLoader />}>
                <ParticipantsPage />
              </Suspense>
            </>
          }
        />

        <Route
          path={ROUTES.RESULT}
          element={
            <>
              <RouteGuard
                require={["contestName", "category", "participants"]}
                redirectTo={ROUTES.HOME}
              />
              <Suspense fallback={<PageLoader />}>
                <ResultPage />
              </Suspense>
            </>
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
    </Routes>
  );
}
