import Link from "next/link";
import { getProjects } from "@/lib/queries/project";
import type { ProjectStatus } from "@/lib/actions/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, FolderKanban } from "lucide-react";

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  COMPLETED: "Completado",
  PAUSED: "Pausado",
  CANCELLED: "Cancelado",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PAUSED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = ["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"].includes(
    status ?? ""
  )
    ? (status as ProjectStatus)
    : undefined;
  const projects = await getProjects(validStatus);

  const tabs = [
    { label: "Todos", href: "/projects", active: !status },
    {
      label: "Activos",
      href: "/projects?status=ACTIVE",
      active: status === "ACTIVE",
    },
    {
      label: "Completados",
      href: "/projects?status=COMPLETED",
      active: status === "COMPLETED",
    },
    {
      label: "Pausados",
      href: "/projects?status=PAUSED",
      active: status === "PAUSED",
    },
    {
      label: "Cancelados",
      href: "/projects?status=CANCELLED",
      active: status === "CANCELLED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 text-foreground font-medium transition-all">
            <Plus className="size-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 relative ${
              tab.active
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.active && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
            )}
          </Link>
        ))}
      </div>

      {/* Projects Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-surface/50 hover:bg-transparent">
              <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider">Nombre</TableHead>
              <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider">Cliente</TableHead>
              <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider">Estado</TableHead>
              <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider">Presupuesto</TableHead>
              <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider">Deadline</TableHead>
              <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider text-center">Tareas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <FolderKanban size={32} className="text-primary" />
                    </div>
                    <span className="font-medium text-foreground">No hay proyectos</span>
                    <span className="text-sm">Crea tu primer proyecto para empezar</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="border-border hover:bg-surface/40 transition-colors cursor-pointer"
                >
                  <TableCell className="font-semibold text-foreground">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted">
                    {project.client.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[project.status]} border font-medium`}>
                      {statusLabels[project.status] ?? project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted font-medium">
                    {project.budget != null
                      ? `${project.currency === "ARS" ? "ARS$" : "$"}${project.budget.toLocaleString("es-AR")}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted">
                    {project.deadline
                      ? format(new Date(project.deadline), "dd MMM yyyy", {
                          locale: es,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold text-xs border border-primary/30 hover:border-primary/60 transition-colors">
                      {project._count.tasks}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
