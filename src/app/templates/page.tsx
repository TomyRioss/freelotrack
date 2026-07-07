import { getTemplates } from "@/lib/queries/template";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { TemplatesTable } from "./templates-table";

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Plantillas</h1>
        </div>
        <Link href="/templates/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all text-sm">
            <Plus size={16} />
            Nueva Plantilla
          </button>
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <TemplatesTable templates={templates} />
      </div>
    </div>
  );
}
