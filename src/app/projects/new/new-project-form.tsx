"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { createProject } from "@/lib/actions/project";

type Client = { id: string; name: string };

interface Props {
  clients: Client[];
}

export function NewProjectForm({ clients }: Props) {
  const [pending, setPending] = useState(false);
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("ACTIVE");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("clientId", clientId);
    formData.set("currency", currency);
    formData.set("status", status);
    if (deadline) formData.set("deadline", deadline.toISOString());

    try {
      await createProject(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el proyecto");
      setPending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo Proyecto</h1>
          <p className="text-sm text-slate-400 mt-1">
            Completa los datos para crear un nuevo proyecto
          </p>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información del Proyecto</CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Nombre <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name" name="name" required
                placeholder="Ej: Landing Page Cliente X"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Descripción</Label>
              <Textarea
                id="description" name="description"
                placeholder="Descripción del proyecto..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId" className="text-slate-300">
                Cliente <span className="text-red-400">*</span>
              </Label>
              <Select value={clientId} onValueChange={(val: string | null) => setClientId(val ?? "")}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {clients.length === 0 ? (
                    <SelectItem value="" disabled>
                      No hay clientes disponibles
                    </SelectItem>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-slate-300">Presupuesto</Label>
                <Input
                  id="budget" name="budget" type="number" step="0.01" min="0"
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-slate-300">Moneda</Label>
                <Select value={currency} onValueChange={(val: string | null) => setCurrency(val ?? "USD")}>
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
              <Label htmlFor="deadline" className="text-slate-300">Deadline</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "inline-flex items-center justify-center w-full rounded-md border px-3 py-2 text-sm font-normal bg-slate-800 border-slate-700 text-white",
                    !deadline && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {deadline ? format(deadline, "PPP", { locale: es }) : "Seleccionar fecha..."}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                  <Calendar mode="single" selected={deadline} onSelect={setDeadline} />
                </PopoverContent>
              </Popover>
              <input type="hidden" name="deadline" value={deadline?.toISOString() ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-300">Estado</Label>
              <Select value={status} onValueChange={(val: string | null) => setStatus(val ?? "ACTIVE")}>
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

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Creando..." : "Crear Proyecto"}
              </Button>
              <Link href="/projects">
                <Button type="button" variant="ghost">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
