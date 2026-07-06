"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileSignature, ChevronRight, Badge } from "lucide-react";

interface ContractRow {
  id: string;
  name: string;
  status: string;
  value: number | null;
  currency: string;
  createdAt: Date;
  client: { id: string; name: string };
  project: { id: string; name: string } | null;
}

export function ContractsTable({ contracts }: { contracts: ContractRow[] }) {
  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      DRAFT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      SIGNED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
      CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return map[s] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const statusLabel: Record<string, string> = {
    DRAFT: "Borrador", SIGNED: "Firmado", COMPLETED: "Completado", CANCELLED: "Cancelado",
  };

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-card">
        <div className="p-3 rounded-full bg-primary/10 mb-4">
          <FileSignature size={48} className="text-primary" />
        </div>
        <p className="text-foreground text-lg font-semibold">No hay contratos aún</p>
        <p className="text-muted text-sm mt-1">Generá tu primer contrato con IA</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            <th className="text-left px-6 py-3 text-foreground font-semibold text-xs uppercase tracking-wider">Nombre</th>
            <th className="text-left px-6 py-3 text-foreground font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Cliente</th>
            <th className="text-left px-6 py-3 text-foreground font-semibold text-xs uppercase tracking-wider">Estado</th>
            <th className="text-right px-6 py-3 text-foreground font-semibold text-xs uppercase tracking-wider">Valor</th>
            <th className="text-left px-6 py-3 text-foreground font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Creado</th>
            <th className="px-6 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id} className="border-b border-border hover:bg-surface/30 transition-colors">
              <td className="px-6 py-4">
                <Link href={`/contracts/${c.id}`} className="text-foreground font-semibold hover:text-primary transition-colors flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <FileSignature size={16} className="text-primary" />
                  </div>
                  {c.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-muted hidden md:table-cell">{c.client.name}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(c.status)}`}>
                  {statusLabel[c.status] ?? c.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-foreground font-medium">
                {c.value != null ? `${c.currency === "ARS" ? "ARS$" : "$"}${c.value.toLocaleString("es-AR")}` : "-"}
              </td>
              <td className="px-6 py-4 text-muted text-xs hidden lg:table-cell">
                {format(new Date(c.createdAt), "dd MMM yyyy", { locale: es })}
              </td>
              <td className="px-6 py-4">
                <ChevronRight size={16} className="text-muted" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
