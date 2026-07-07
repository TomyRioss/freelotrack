import { getContract } from "@/lib/queries/contract";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileSignature, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { updateContractStatus, deleteContract } from "@/lib/actions/contract";
import type { Payment } from "@prisma/client";

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  SIGNED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};
const statusLabels: Record<string, string> = {
  DRAFT: "Borrador", SIGNED: "Firmado", COMPLETED: "Completado", CANCELLED: "Cancelado",
};

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contracts" className="text-muted hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{contract.name}</h1>
            <p className="text-sm text-muted mt-1">{contract.client.name} · {contract.project?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusColors[contract.status]}`}>
            {statusLabels[contract.status] ?? contract.status}
          </span>
        </div>
      </div>

      {/* Status actions */}
      <div className="flex items-center gap-3">
        {contract.status === "DRAFT" && (
          <form action={updateContractStatus.bind(null, contract.id, "SIGNED")}>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg transition-all text-sm">
              Marcar como Firmado
            </button>
          </form>
        )}
        {contract.status === "SIGNED" && (
          <form action={updateContractStatus.bind(null, contract.id, "COMPLETED")}>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-foreground font-medium hover:shadow-lg transition-all text-sm">
              Marcar como Completado
            </button>
          </form>
        )}
        <form
          action={deleteContract.bind(null, contract.id)}
          onSubmit={(e) => { if (!confirm("¿Eliminar contrato?")) e.preventDefault(); }}
        >
          <button className="px-3 py-2 rounded-lg text-sm text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all">
            Eliminar
          </button>
        </form>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Valor</p>
          <p className="text-xl font-bold text-foreground">
            {contract.value != null
              ? `${contract.currency === "ARS" ? "ARS$" : "$"}${contract.value.toLocaleString("es-AR")}`
              : "—"}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Cliente</p>
          <p className="text-sm font-semibold text-foreground">{contract.client.name}</p>
          {contract.client.email && <p className="text-xs text-muted mt-0.5">{contract.client.email}</p>}
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Creado</p>
          <p className="text-sm font-semibold text-foreground">
            {format(new Date(contract.createdAt), "dd MMM yyyy HH:mm", { locale: es })}
          </p>
          {contract.signedAt && <p className="text-xs text-muted mt-0.5">Firmado: {format(new Date(contract.signedAt), "dd MMM yyyy", { locale: es })}</p>}
        </div>
      </div>

      {/* Contract content */}
      <div className="p-6 rounded-lg bg-card border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contenido del Contrato</h2>
        <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
          {contract.content}
        </div>
      </div>

      {/* Payments */}
      {contract.payments.length > 0 && (
        <div className="p-4 rounded-lg bg-card border border-border">
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Pagos ({contract.payments.length})</h2>
          <div className="space-y-2">
            {contract.payments.map((p: Payment) => (
              <div key={p.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface/50">
                <div>
                  <p className="text-sm text-foreground font-medium">${p.amount.toLocaleString("es-AR")}</p>
                  <p className="text-xs text-muted">Vence {format(new Date(p.dueDate), "dd MMM yyyy", { locale: es })}</p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                  p.status === "PAID" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                  p.status === "OVERDUE" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
