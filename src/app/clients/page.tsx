import { getClients } from "@/lib/queries/client";
import Link from "next/link";
import { ClientsTable } from "./client-table";
import { Plus } from "lucide-react";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <Link
          href="/clients/new"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo Cliente
        </Link>
      </div>
      <ClientsTable clients={clients} />
    </div>
  );
}
