"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit3,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  updateProject,
  updateProjectStatus,
  deleteProject,
  type ProjectStatus,
} from "@/lib/actions/project";
import { createTask, toggleTask, deleteTask } from "@/lib/actions/task";

// ─── Types ──────────────────────────────────────────────────────────────────

type SerializedTask = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  projectId: string;
  createdAt: string;
};

type SerializedContract = {
  id: string;
  name: string;
  status: string;
  value: number | null;
  currency: string;
  createdAt: string;
  signedAt: string | null;
};

type SerializedProject = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  budget: number | null;
  currency: string;
  deadline: string | null;
  clientId: string;
  client: { id: string; name: string };
  tasks: SerializedTask[];
  contracts: SerializedContract[];
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const contractStatusColors: Record<string, string> = {
  DRAFT: "bg-yellow-500/20 text-yellow-400",
  SIGNED: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

// ─── Main Component ─────────────────────────────────────────────────────────

export function ProjectDetailClient({
  project,
  clients = [],
}: {
  project: SerializedProject;
  clients: { id: string; name: string }[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDescription, setEditDescription] = useState(
    project.description ?? ""
  );
  const [editBudget, setEditBudget] = useState(
    project.budget?.toString() ?? ""
  );
  const [editCurrency, setEditCurrency] = useState(project.currency);
  const [editDeadline, setEditDeadline] = useState<Date | undefined>(
    project.deadline ? new Date(project.deadline) : undefined
  );
  const [editStatus, setEditStatus] = useState(project.status);
  const [editClients, setEditClients] = useState<
    { id: string; name: string }[]
  >(clients);
  const [editClientId, setEditClientId] = useState(project.clientId);
  const [error, setError] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.set("name", editName);
    formData.set("description", editDescription);
    formData.set("budget", editBudget);
    formData.set("currency", editCurrency);
    formData.set("status", editStatus);
    formData.set("clientId", editClientId);
    if (editDeadline) {
      formData.set("deadline", editDeadline.toISOString());
    }

    try {
      await updateProject(project.id, formData);
      setEditOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el proyecto"
      );
    }
  }

  async function handleNewTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", newTaskTitle);
    try {
      await createTask(project.id, formData);
      setNewTaskTitle("");
      setNewTaskOpen(false);
    } catch (err) {
      // silent
    }
  }

  async function handleToggleTask(taskId: string) {
    try {
      await toggleTask(taskId);
    } catch (err) {
      // silent
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);
    } catch (err) {
      // silent
    }
  }

  async function handleStatusChange(status: ProjectStatus) {
    try {
      await updateProjectStatus(project.id, status);
    } catch (err) {
      // silent
    }
  }

  async function handleDeleteProject() {
    if (!confirm("¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    try {
      await deleteProject(project.id);
    } catch (err) {
      // silent
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="text-slate-400 hover:text-white transition-colors mt-1"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <Badge className={statusColors[project.status]}>
                {statusLabels[project.status] ?? project.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Cliente: {project.client.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              Editar
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
                <DialogDescription>
                  Modifica los datos del proyecto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-slate-300">
                    Nombre <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-desc" className="text-slate-300">
                    Descripción
                  </Label>
                  <Textarea
                    id="edit-desc"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white min-h-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Cliente</Label>
                  <Select
                    value={editClientId}
                    onValueChange={(val: string | null) => setEditClientId(val ?? "")}
                  >
                    <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {editClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-budget"
                      className="text-slate-300"
                    >
                      Presupuesto
                    </Label>
                    <Input
                      id="edit-budget"
                      type="number"
                      step="0.01"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Moneda</Label>
                    <Select
                      value={editCurrency}
                      onValueChange={(val: string | null) => setEditCurrency(val ?? "USD")}
                    >
                      <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="ARS">ARS (ARS$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Deadline</Label>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        "inline-flex items-center justify-center w-full rounded-md border px-3 py-2 text-sm font-normal bg-slate-800 border-slate-700 text-white",
                        !editDeadline && "text-slate-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {editDeadline
                        ? format(editDeadline, "PPP", { locale: es })
                        : "Seleccionar fecha..."}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                      <Calendar
                        mode="single"
                        selected={editDeadline}
                        onSelect={setEditDeadline}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Estado</Label>
                  <Select value={editStatus} onValueChange={(val: string | null) => setEditStatus(val ?? "ACTIVE")}>
                    <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="ACTIVE">Activo</SelectItem>
                      <SelectItem value="PAUSED">Pausado</SelectItem>
                      <SelectItem value="COMPLETED">Completado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit">Guardar Cambios</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm"><MoreHorizontal className="size-4" /></Button>} />
            <DropdownMenuContent className="bg-slate-900 border-slate-700 text-white">
              <DropdownMenuItem
                onClick={() => handleStatusChange("ACTIVE")}
                disabled={project.status === "ACTIVE"}
              >
                Marcar como Activo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("PAUSED")}
                disabled={project.status === "PAUSED"}
              >
                Pausar Proyecto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={project.status === "COMPLETED"}
              >
                Completar Proyecto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={project.status === "CANCELLED"}
              >
                Cancelar Proyecto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteProject}
                variant="destructive"
              >
                Eliminar Proyecto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Project Info */}
      {project.description && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {project.budget != null
                ? `${project.currency === "ARS" ? "ARS$" : "$"}${project.budget.toLocaleString("es-AR")}`
                : "No definido"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {completedTasks}/{totalTasks}
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  totalTasks > 0 && completedTasks === totalTasks
                    ? "bg-green-500"
                    : "bg-blue-500"
                )}
                style={{
                  width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%",
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalTasks > 0
                ? `${Math.round((completedTasks / totalTasks) * 100)}% completado`
                : "Sin tareas"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Deadline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {project.deadline
                ? format(new Date(project.deadline), "dd MMM yyyy", {
                    locale: es,
                  })
                : "No definido"}
            </div>
            {project.deadline &&
              new Date(project.deadline) > new Date() && (
                <p className="text-xs text-slate-500 mt-1">
                  {Math.ceil(
                    (new Date(project.deadline).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  días restantes
                </p>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Tareas</CardTitle>
            <CardDescription>
              {totalTasks} tarea{totalTasks !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
            <DialogTrigger render={<Button size="sm"><Plus className="size-4" /> Nueva Tarea</Button>} />
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Tarea</DialogTitle>
                <DialogDescription>
                  Agrega una nueva tarea al proyecto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title" className="text-slate-300">
                    Título <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="task-title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Ej: Diseñar wireframes"
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!newTaskTitle.trim()}>
                    Crear Tarea
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {project.tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="size-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                No hay tareas en este proyecto
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Agrega la primera tarea usando el botón &quot;Nueva Tarea&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-2.5 transition-colors group",
                    task.completed
                      ? "bg-slate-800/30"
                      : "hover:bg-slate-800/50"
                  )}
                >
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="shrink-0 text-slate-500 hover:text-blue-400 transition-colors"
                    title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="size-5 text-green-500" />
                    ) : (
                      <Circle className="size-5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        task.completed
                          ? "text-slate-500 line-through"
                          : "text-white"
                      )}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-slate-600 mt-0.5">
                        {format(new Date(task.dueDate), "dd MMM", {
                          locale: es,
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="shrink-0 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contracts Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Contratos Asociados</CardTitle>
              <CardDescription>
                {project.contracts.length} contrato
                {project.contracts.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Link href={`/contracts/new?projectId=${project.id}`}>
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Nuevo Contrato
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {project.contracts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No hay contratos asociados a este proyecto
            </p>
          ) : (
            <div className="space-y-2">
              {project.contracts.map((contract) => (
                <Link
                  key={contract.id}
                  href={`/contracts/${contract.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-white">
                        {contract.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Creado{" "}
                        {format(new Date(contract.createdAt), "dd MMM yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {contract.value != null && (
                      <span className="text-sm text-slate-300">
                        {contract.currency === "ARS" ? "ARS$" : "$"}
                        {contract.value.toLocaleString("es-AR")}
                      </span>
                    )}
                    <Badge
                      className={
                        contractStatusColors[contract.status] ??
                        "bg-slate-500/20 text-slate-400"
                      }
                    >
                      {contract.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
