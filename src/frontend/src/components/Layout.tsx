import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  {
    to: "/activities",
    label: "Activities",
    icon: Activity,
    ocid: "nav.activities.link",
  },
  { to: "/targets", label: "Targets", icon: Target, ocid: "nav.targets.link" },
  {
    to: "/performance",
    label: "Student Performance",
    icon: GraduationCap,
    ocid: "nav.performance.link",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal ? `${principal.slice(0, 8)}…` : null;
  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-foreground/30 lg:hidden w-full cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-30 flex flex-col w-64 h-full bg-sidebar transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <img
            src="/assets/generated/university-logo-transparent.dim_80x80.png"
            alt="University Hub"
            className="w-9 h-9 rounded object-contain bg-white/10 p-0.5"
          />
          <div>
            <p className="text-sidebar-foreground font-display font-bold text-sm leading-tight">
              University
            </p>
            <p className="text-sidebar-foreground/70 text-xs">Department Hub</p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, ocid }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Auth area */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          {isInitializing ? (
            <div className="text-sidebar-foreground/50 text-xs text-center py-1">
              Loading…
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                  <span className="text-sidebar-primary text-xs font-bold">
                    U
                  </span>
                </div>
                <span className="text-sidebar-foreground/70 text-xs truncate flex-1">
                  {shortPrincipal}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 text-xs"
                onClick={clear}
              >
                <LogOut size={13} className="mr-1.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 text-xs font-semibold"
              onClick={login}
            >
              <LogIn size={13} className="mr-1.5" />
              Sign In
            </Button>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center gap-4 px-6 py-3.5 bg-card border-b border-border shadow-xs flex-shrink-0">
          <button
            type="button"
            aria-label="Open sidebar"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-foreground text-lg tracking-tight">
              University Department Hub
            </h1>
            <p className="text-muted-foreground text-xs hidden sm:block">
              Academic Management & Performance Tracking
            </p>
          </div>
          {!isLoggedIn && !isInitializing && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs hidden sm:flex"
              onClick={login}
            >
              <LogIn size={13} className="mr-1.5" />
              Admin Sign In
            </Button>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
