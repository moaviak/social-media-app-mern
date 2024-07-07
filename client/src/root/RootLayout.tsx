import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PulseLoader } from "react-spinners";

// Lazy load components
const Topbar = lazy(() => import("@/components/shared/Topbar"));
const Bottombar = lazy(() => import("@/components/shared/Bottombar"));
const LeftSidebar = lazy(() => import("@/components/shared/LeftSidebar"));

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Suspense fallback={<PulseLoader color="#fff" />}>
        <Topbar />
        <LeftSidebar />
      </Suspense>

      <section className="flex flex-1 h-full overflow-x-hidden">
        <Outlet />
      </section>

      <Suspense fallback={<div>Loading...</div>}>
        <Bottombar />
      </Suspense>
    </div>
  );
};

export default RootLayout;
