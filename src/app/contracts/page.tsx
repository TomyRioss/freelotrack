import { getContracts } from "@/lib/queries/contract";
import Link from "next/link";
import { Plus, FileSignature } from "lucide-react";
import { ContractsTable } from "./contracts-table";

export const dynamic = 'force-dynamic';

export default async function ContractsPage() {
  const contracts = await getContracts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Contratos</h1>
        </div>
        <Link href="/contracts/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all text-sm">
            <Plus size={16} />
            Nuevo Contrato
          </button>
        </Link>
      </div>
      <ContractsTable contracts={contracts} />
    </div>
  );
}
