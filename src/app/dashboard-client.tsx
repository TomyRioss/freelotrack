"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Calendar, DollarSign, Clock, ArrowRight, FileSignature } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardProps {
  activeProjects: number;
  upcomingDeadlines: { id: string; name: string; clientName: string; deadline: string }[];
  monthlyIncome: number;
  pendingPayments: number;
  recentContracts: { id: string; name: string; clientName: string; status: string; value: number; createdAt: string }[];
}

export function DashboardClient({
  activeProjects,
  upcomingDeadlines,
  monthlyIncome,
  pendingPayments,
  recentContracts,
}: DashboardProps) {
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: "bg-yellow-500/20 text-yellow-400",
      SIGNED: "bg-blue-500/20 text-blue-400",
      COMPLETED: "bg-green-500/20 text-green-400",
      CANCELLED: "bg-red-500/20 text-red-400",
    };
    return map[status] ?? "bg-muted/20 text-muted";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Proyectos Activos</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
              <FolderKanban className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activeProjects}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Deadlines Próximos</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-colors">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{upcomingDeadlines.length}</div>
            <p className="text-xs text-muted/70 mt-1">en los próximos 7 días</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Ingresos del Mes</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-colors">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${monthlyIncome.toLocaleString("es-AR")}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-destructive/50 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Pagos Pendientes</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-colors">
              <Clock className="h-5 w-5 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              ${pendingPayments.toLocaleString("es-AR")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="bg-card border-border hover:border-orange-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
              <CardTitle className="text-sm font-medium text-foreground">Deadlines Próximos</CardTitle>
            </div>
            <Link href="/projects" className="text-xs text-primary hover:text-secondary transition-colors flex items-center gap-1 font-medium">
              Ver todos <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted">No hay deadlines próximos</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface/40 hover:bg-surface/80 border border-border/50 hover:border-orange-500/30 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-xs text-muted">{p.clientName}</p>
                    </div>
                    <span className="text-xs text-orange-400 font-bold px-2 py-1 rounded-md bg-orange-500/10">
                      {format(new Date(p.deadline), "dd MMM", { locale: es })}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Contracts */}
        <Card className="bg-card border-border hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
              <CardTitle className="text-sm font-medium text-foreground">Últimos Contratos</CardTitle>
            </div>
            <Link href="/contracts" className="text-xs text-primary hover:text-secondary transition-colors flex items-center gap-1 font-medium">
              Ver todos <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentContracts.length === 0 ? (
              <p className="text-sm text-muted">No hay contratos aún</p>
            ) : (
              <div className="space-y-3">
                {recentContracts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contracts/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface/40 hover:bg-surface/80 border border-border/50 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <FileSignature size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                        <p className="text-xs text-muted">{c.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">${c.value.toLocaleString("es-AR")}</span>
                      <Badge className={`text-xs font-medium border ${statusBadge(c.status)}`}>
                        {c.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
