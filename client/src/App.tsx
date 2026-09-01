/* Paper Garden style: routes share the same editorial vocabulary while the teacher workspace shifts into an ink-blue desk layout. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Access from "@/pages/Access";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function ProtectedDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <div className="route-loading"><div className="loading-mark" /><span>Opening the teacher desk…</span></div>;
  if (!user) return <Redirect to="/access" />;
  return <Dashboard />;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/access" component={Access} /><Route path="/dashboard" component={ProtectedDashboard} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><AuthProvider><TooltipProvider><Toaster position="top-right" /><Router /></TooltipProvider></AuthProvider></ThemeProvider></ErrorBoundary>;
}
