"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Pencil, Trash2, ChevronRight } from "lucide-react";
import { deleteTemplate } from "@/lib/actions/template";

interface TemplateRow {
  id: string;
  name: string;
  description: string | null;
  content: string;
  createdAt: Date;
}

export function TemplatesTable({ templates }: { templates: TemplateRow[] }) {
  return (
    <div className="divide-y divide-border">
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-3 rounded-full bg-primary/10 mb-4">
            <FileText size={48} className="text-primary" />
          </div>
          <p className="text-foreground text-lg font-semibold">Aún no hay plantillas</p>
          <p className="text-muted text-sm mt-1">Crea tu primera plantilla de contrato para empezar</p>
        </div>
      ) : (
        templates.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface/30 transition-colors">
            <Link href={`/templates/${t.id}/edit`} className="flex-1 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                {t.description && <p className="text-xs text-muted mt-0.5">{t.description}</p>}
                <p className="text-xs text-muted/60 mt-0.5">
                  Creado {format(new Date(t.createdAt), "dd MMM yyyy", { locale: es })}
                  · {t.content.length} caracteres
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/templates/${t.id}/edit`}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-border/50 transition-all"
              >
                <Pencil size={16} />
              </Link>
              <form
                action={deleteTemplate.bind(null, t.id)}
                onSubmit={(e) => { if (!confirm("¿Eliminar plantilla?")) e.preventDefault(); }}
              >
                <button type="submit" className="p-2 rounded-lg text-muted hover:text-destructive hover:bg-destructive/10 transition-all">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
