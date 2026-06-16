import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { TenantProvider } from "@/lib/tenant-context";
import { AppLayout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Register from "@/pages/register";
import Departments from "@/pages/departments";
import DepartmentDetail from "@/pages/department-detail";
import Reports from "@/pages/reports";
import Audit from "@/pages/audit";
import Admin from "@/pages/admin";
import RiskSightAI from "@/pages/risksight";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/register" component={Register} />
        <Route path="/departments" component={Departments} />
        <Route path="/departments/:id" component={DepartmentDetail} />
        <Route path="/reports" component={Reports} />
        <Route path="/audit" component={Audit} />
        <Route path="/admin" component={Admin} />
        <Route path="/risksight" component={RiskSightAI} />
        <Route path="/" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="nexis-theme">
        <TenantProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
