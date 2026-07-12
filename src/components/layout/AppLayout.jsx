import { Outlet } from "react-router-dom";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { GlobalConfirmDialog } from "@/components/common/GlobalConfirmDialog";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <GlobalConfirmDialog />
    </div>
  );
}
