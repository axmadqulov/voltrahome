import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity, BarChart3, Bell, ChevronsLeft, CreditCard, Droplets, Flame, LayoutDashboard, LogOut, Menu, Power, Settings, User, Zap,
} from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { getSession, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ProtectedRoute: client-only layout that redirects to /login without a session.
export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: () => {
    if (!getSession()) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/gas", label: "Gaz kuchaytirgich", icon: Flame },
  { to: "/dashboard/payments", label: "Kommunal to'lovlar", icon: CreditCard },
  { to: "/dashboard/electricity", label: "Elektr energiyasi", icon: Zap },
  { to: "/dashboard/water", label: "Suv boshqaruvi", icon: Droplets },
  { to: "/dashboard/remote-control", label: "Masofadan boshqarish", icon: Power },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

function DashboardLayout() {
  const { user, unread, logout } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", replace: true });
  };

  const current = NAV.find((n) => ("exact" in n ? pathname === n.to : pathname.startsWith(n.to)));
  const initial = (user?.username ?? "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {mobileOpen && <div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm md:hidden animate-in fade-in" onClick={() => setMobileOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-sidebar-border px-5", collapsed && "md:justify-center md:px-0")}>
          <Logo compact={collapsed && !mobileOpen} />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => {
            const active = "exact" in n ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                title={n.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "md:justify-center md:px-0",
                )}
              >
                <n.icon className="size-5 shrink-0" />
                <span className={cn("truncate", collapsed && "md:hidden")}>{n.label}</span>
                {n.to === "/dashboard/notifications" && unread > 0 && (
                  <span className={cn("ml-auto rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground", collapsed && "md:hidden")}>{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10", collapsed && "md:justify-center md:px-0")}
          >
            <LogOut className="size-5" />
            <span className={cn(collapsed && "md:hidden")}>Logout</span>
          </button>
        </div>
      </aside>

      <div className={cn("transition-all duration-300", collapsed ? "md:pl-20" : "md:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-lg sm:px-6">
          <button className="rounded-lg p-2 hover:bg-muted md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <button className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted md:inline-flex" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar">
            <ChevronsLeft className={cn("size-5 transition-transform", collapsed && "rotate-180")} />
          </button>
          <p className="truncate font-semibold">{current?.label ?? "Dashboard"}</p>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-semibold text-success sm:inline-flex">
              <Activity className="size-3.5" /> All systems live
            </span>
            <Link to="/dashboard/notifications" className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications">
              <Bell className="size-5" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{unread}</span>
              )}
            </Link>
            <Link to="/dashboard/profile" className="flex items-center gap-2 rounded-xl p-1 pr-3 transition-colors hover:bg-muted">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="size-8 rounded-lg object-cover" />
              ) : (
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{initial}</span>
              )}
              <span className="hidden text-sm font-medium sm:inline">{user?.username}</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
