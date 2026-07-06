"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateTemplate, deleteTemplate } from "@/lib/actions/template";

interface Props {
  template: { id: string; name: string; description: string | null; content: string };
}

export function EditTemplateForm({ template }: Props) {
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || "");
  const [content, setContent] = useState(template.content);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateTemplate(template.id, { name, description: description || undefined, content });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/templates" className="text-muted hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Editar Plantilla</h1>
        </div>
        <form
          action={deleteTemplate.bind(null, template.id)}
          onSubmit={(e) => { if (!confirm("¿Eliminar plantilla?")) e.preventDefault(); }}
        >
          <button type="submit" className="px-3 py-1.5 rounded-lg text-sm text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all">
            Eliminar
          </button>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nombre *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Contenido (Markdown)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none font-mono" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all text-sm disabled:opacity-50">
            {loading ? "Guardando..." : "Guardar Cambios"}
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
