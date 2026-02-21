
import { Outlet } from "react-router";
import Header from "./Header";
import { Toaster } from "@/components/ui/sonner";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default DashboardLayout;
