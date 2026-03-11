import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import StudentPerformancePage from "./pages/StudentPerformance";
import Targets from "./pages/Targets";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});
const activitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activities",
  component: Activities,
});
const targetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/targets",
  component: Targets,
});
const performanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/performance",
  component: StudentPerformancePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  activitiesRoute,
  targetsRoute,
  performanceRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
