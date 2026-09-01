/* Paper Garden style: routes share the same editorial vocabulary while approval states use calm school-office language instead of abrupt access errors. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Redirect, Route, Switch, Link } from "wouter";
import { ArrowLeft, Clock3, LogOut, ShieldCheck } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Access from "@/pages/Access";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

function ApprovalGate() {
  const { profile, logOut } = useAuth();
  return <div className="approval-page"><div className="approval-card"><div className="approval-card__mark"><Clock3 size={24} /></div><span className="eyebrow">Teacher desk · review in progress</span><h1>Your account is<br /><em>in good hands.</em></h1><p>The school office needs to approve your teacher account before you can publish updates. We’ll keep your place here while your details are reviewed.</p>{profile?.status === "rejected" && <div className="approval-rejected"><strong>A note from the office</strong><span>This account is not approved for publishing yet. Please contact the school office if you think this is a mistake.</span></div>}<div className="approval-card__actions"><Link className="button button--ink" href="/"><ArrowLeft size={16} /> Back to school home</Link><button className="text-button" onClick={() => logOut()}><LogOut size={15} /> Sign out</button></div></div></div>;
}
function ProtectedDashboard() { const { user, loading, isApproved } = useAuth(); if (loading) return <div className="route-loading"><div className="loading-mark" /><span>Opening the teacher desk…</span></div>; if (!user) return <Redirect to="/access" />; if (!isApproved) return <ApprovalGate />; return <Dashboard />; }
function ProtectedAdmin() { const { user, loading, isAdmin } = useAuth(); if (loading) return <div className="route-loading"><div className="loading-mark" /><span>Opening the school office…</span></div>; if (!user) return <Redirect to="/access" />; if (!isAdmin) return <Redirect to="/dashboard" />; return <Admin />; }
function Router() { return <Switch><Route path="/" component={Home} /><Route path="/access" component={Access} /><Route path="/dashboard" component={ProtectedDashboard} /><Route path="/admin" component={ProtectedAdmin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><AuthProvider><TooltipProvider><Toaster position="top-right" /><Router /></TooltipProvider></AuthProvider></ThemeProvider></ErrorBoundary>; }
