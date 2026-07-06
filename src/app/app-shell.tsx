"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  FileSignature,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Proyectos", href: "/projects", icon: FolderKanban },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Contratos", href: "/contracts", icon: FileSignature },
  { label: "Plantillas", href: "/templates", icon: FileText },
  { label: "Métricas", href: "/metrics", icon: BarChart3 },
  { label: "Configuración", href: "/settings", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-surface/40 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ✨ FreeloTrack
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted hover:text-foreground hover:bg-border/50 transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground shadow-lg shadow-primary/10"
                    : "text-muted hover:bg-border/30 hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted hover:bg-border/30 hover:text-destructive transition-all duration-200",
              collapsed && "justify-center"
            )}
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
    </div>
  );
}
