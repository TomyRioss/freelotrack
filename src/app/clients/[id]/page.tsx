import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Pencil,
  FolderKanban,
  FileSignature,
  DollarSign,
  CheckCircle2,
  Briefcase,
  ChevronRight,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { getClient } from "@/lib/queries/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteClientButton } from "./delete-button";

interface Props {
  params: Promise<{ id: string }>;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    DRAFT: "bg-yellow-500/20 text-yellow-400",
    SIGNED: "bg-blue-500/20 text-blue-400",
    COMPLETED: "bg-green-500/20 text-green-400",
    CANCELLED: "bg-red-500/20 text-red-400",
    ACTIVE: "bg-green-500/20 text-green-400",
    PAUSED: "bg-orange-500/20 text-orange-400",
  };
  return map[status] ?? "bg-surface text-muted";
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    DRAFT: "Borrador",
    SIGNED: "Firmado",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
    ACTIVE: "Activo",
    PAUSED: "Pausado",
  };
  return map[status] ?? status;
};

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  // Derive metrics
  const projects = client.projects ?? [];
  const contracts = client.contracts ?? [];
  const completedProjects = projects.filter(
    (p: { status: string }) => p.status === "COMPLETED"
  ).length;
  const activeContracts = contracts.filter(
    (c: { status: string }) => c.status === "SIGNED" || c.status === "DRAFT"
  ).length;
  const totalBilled = contracts.reduce(
    (sum: number, c: { payments?: { status: string; amount: number }[] }) =>
      sum +
      (c.payments
        ?.filter((p: { status: string }) => p.status === "PAID")
        .reduce((ps: number, p: { amount: number }) => ps + p.amount, 0) ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
            {client.company && (
              <p className="text-sm text-muted">{client.company}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/clients/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil size={14} />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Contact Info */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted">
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {client.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted shrink-0" />
              <a
                href={`mailto:${client.email}`}
                className="text-blue-400 hover:underline text-sm"
              >
                {client.email}
              </a>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-muted shrink-0" />
              <a
                href={`tel:${client.phone}`}
                className="text-blue-400 hover:underline text-sm"
              >
                {client.phone}
              </a>
            </div>
          )}
          {client.company && (
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-muted shrink-0" />
              <span className="text-foreground text-sm">{client.company}</span>
            </div>
          )}
          {!client.email && !client.phone && !client.company && (
            <p className="text-sm text-muted/70">
              No se ha registrado información de contacto adicional
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {client.notes && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm whitespace-pre-wrap">
              {client.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Total Facturado
            </CardTitle>
            <DollarSign size={16} className="text-green-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              ${totalBilled.toLocaleString("es-AR")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Proyectos Completados
            </CardTitle>
            <CheckCircle2 size={16} className="text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {completedProjects}
              <span className="text-sm text-muted/70 font-normal ml-1">
                / {projects.length}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Contratos Activos
            </CardTitle>
            <FileSignature size={16} className="text-orange-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{activeContracts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <FolderKanban size={16} />
            Proyectos ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">
              No hay proyectos asociados a este cliente
            </p>
          ) : (
            <div className="divide-y divide-border">
              {projects.map(
                (project: {
                  id: string;
                  name: string;
                  status: string;
                  deadline: Date | null;
                  _count?: { tasks: number };
                }) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between py-3 hover:bg-surface/50 -mx-4 px-4 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Briefcase size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted">
                          {project.deadline
                            ? `Vence ${format(new Date(project.deadline), "dd MMM yyyy", { locale: es })}`
                            : "Sin fecha límite"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`text-xs ${statusBadge(project.status)}`}
                      >
                        {statusLabel(project.status)}
                      </Badge>
                      <ChevronRight size={14} className="text-muted" />
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contracts */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileSignature size={16} />
            Contratos ({contracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">
              No hay contratos asociados a este cliente
            </p>
          ) : (
            <div className="divide-y divide-border">
              {contracts.map(
                (contract: {
                  id: string;
                  name: string;
                  status: string;
                  value: number | null;
                  project?: { id: string; name: string } | null;
                }) => (
                  <Link
                    key={contract.id}
                    href={`/contracts/${contract.id}`}
                    className="flex items-center justify-between py-3 hover:bg-surface/50 -mx-4 px-4 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <FileSignature size={14} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {contract.name}
                        </p>
                        {contract.project && (
                          <p className="text-xs text-muted">
                            {contract.project.name}
                            {contract.value && (
                              <>
                                {" · "}$
                                {contract.value.toLocaleString("es-AR")}
                              </>
                            )}
                          </p>
                        )}
                        {!contract.project && contract.value && (
                          <p className="text-xs text-muted">
                            ${contract.value.toLocaleString("es-AR")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`text-xs ${statusBadge(contract.status)}`}
                      >
                        {statusLabel(contract.status)}
                      </Badge>
                      <ChevronRight size={14} className="text-muted" />
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata & Delete */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted space-y-0.5">
          <p>
            Creado:{" "}
            {format(new Date(client.createdAt), "dd MMM yyyy HH:mm", {
              locale: es,
            })}
          </p>
          <p>
            Actualizado:{" "}
            {format(new Date(client.updatedAt), "dd MMM yyyy HH:mm", {
              locale: es,
            })}
          </p>
        </div>
        <DeleteClientButton
          clientId={client.id}
          clientName={client.name}
        />
      </div>
    </div>
  );
}
