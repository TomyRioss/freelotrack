"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface ClientRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  createdAt: Date;
  _count: {
    projects: number;
    contracts: number;
  };
}

interface ClientsTableProps {
  clients: ClientRow[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q))
    );
  }, [clients, search]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <Input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-surface border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-surface/20 p-8">
          <div className="p-3 rounded-full bg-primary/10 mb-4">
            <Users size={48} className="text-primary" />
          </div>
          <p className="text-foreground text-lg font-semibold">
            {search
              ? "No se encontraron clientes"
              : "Aún no hay clientes"}
          </p>
          <p className="text-muted text-sm mt-1">
            {search
              ? "Intenta con otro término de búsqueda"
              : "Crea tu primer cliente para empezar"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-surface/50 hover:bg-transparent">
                <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider">
                  Nombre
                </TableHead>
                <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                  Email
                </TableHead>
                <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                  Empresa
                </TableHead>
                <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">
                  Teléfono
                </TableHead>
                <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider text-center">
                  Proyectos
                </TableHead>
                <TableHead className="text-foreground font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">
                  Creado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-border cursor-pointer hover:bg-surface/50 transition-colors"
                  onClick={() =>
                    (window.location.href = `/clients/${client.id}`)
                  }
                >
                  <TableCell className="text-foreground font-semibold">
                    <Link href={`/clients/${client.id}`} className="hover:text-primary transition-colors">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted hidden sm:table-cell text-sm">
                    {client.email || (
                      <span className="text-muted/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted hidden md:table-cell text-sm">
                    {client.company || (
                      <span className="text-muted/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted hidden lg:table-cell text-sm">
                    {client.phone || (
                      <span className="text-muted/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-semibold text-xs border border-primary/30 hover:border-primary/60 transition-colors">
                      {client._count.projects}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted text-xs hidden sm:table-cell">
                    {format(new Date(client.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
