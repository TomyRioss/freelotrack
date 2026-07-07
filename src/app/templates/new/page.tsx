"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createTemplate } from "@/lib/actions/template";

export const dynamic = 'force-dynamic';

export default function NewTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLInputElement).value || undefined,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement).value,
    };
    await createTemplate(data);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/templates" className="text-muted hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Nueva Plantilla</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nombre *</label>
          <input name="name" required placeholder="Ej: Contrato de Servicios Profesionales"
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <input name="description" placeholder="Breve descripción de la plantilla"
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Contenido (Markdown) *</label>
          <p className="text-xs text-muted">Usá [VARIABLE] para marcar campos variables. Ej: [CLIENTE], [PRECIO], [FECHA]</p>
          <textarea
            name="content" required rows={20}
            placeholder="# CONTRATO DE SERVICIOS&#10;&#10;Entre [CLIENTE] y [PROFESIONAL]...&#10;&#10;## 1. OBJETO&#10;[ALCANCE]&#10;&#10;## 2. PRECIO&#10;[PRECIO]&#10;"
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none font-mono"
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all text-sm disabled:opacity-50">
            {loading ? "Creando..." : "Crear Plantilla"}
          </button>
          <Link href="/templates">
            <button type="button" className="px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground transition-all text-sm">
              Cancelar
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
