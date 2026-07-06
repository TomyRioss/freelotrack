"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wand2, Loader2, Check } from "lucide-react";
import { createContract, generateContractContent } from "@/lib/actions/contract";

type Client = { id: string; name: string };
type Project = { id: string; name: string };
type Template = { id: string; name: string; content: string };

interface Props {
  clients: Client[];
  projects: Project[];
  templates: Template[];
}

export function ContractWizard({ clients, projects, templates }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    clientId: "",
    projectId: "",
    templateId: "",
    scope: "",
    price: "",
    currency: "USD",
    paymentMethod: "",
    startDate: "",
    deliveryDate: "",
    deliverables: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const selectedTemplate = templates.find((t) => t.id === form.templateId);
  const selectedClient = clients.find((c) => c.id === form.clientId);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generateContractContent({
        templateContent: selectedTemplate!.content,
        clientName: selectedClient?.name ?? "",
        projectName: projects.find((p) => p.id === form.projectId)?.name ?? "",
        scope: form.scope,
        price: form.price,
        currency: form.currency,
        paymentMethod: form.paymentMethod,
        startDate: form.startDate,
        deliveryDate: form.deliveryDate,
        deliverables: form.deliverables,
      });
      setGeneratedContent(result.stdout.trim());
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar el contrato");
    }
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    await createContract({
      name: form.name,
      clientId: form.clientId,
      projectId: form.projectId,
      templateId: form.templateId || undefined,
      content: generatedContent,
      value: form.price ? parseFloat(form.price) : undefined,
      currency: form.currency,
    });
  }

  const inputClass = "w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none";
  const labelClass = "text-sm font-medium text-foreground";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/contracts" className="text-muted hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo Contrato</h1>
          <p className="text-sm text-muted mt-1">Generá un contrato personalizado con IA</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex gap-2">
        {["Datos básicos", "Variables", "Generar", "Guardar"].map((label, i) => (
          <div key={i} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all ${step > i + 1 ? "bg-primary/20 text-primary" : step === i + 1 ? "bg-primary text-foreground" : "bg-surface text-muted"}`}>
            {step > i + 1 ? <Check size={14} className="inline mr-1" /> : `${i + 1}. `}{label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">{error}</div>
      )}

      {/* Step 1: Basic data */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className={labelClass}>Nombre del contrato *</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ej: Landing Page - Cliente X" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Cliente *</label>
              <select value={form.clientId} onChange={(e) => update("clientId", e.target.value)} className={inputClass}>
                <option value="">Seleccionar...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Proyecto *</label>
              <select value={form.projectId} onChange={(e) => update("projectId", e.target.value)} className={inputClass}>
                <option value="">Seleccionar...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Plantilla base *</label>
            <select value={form.templateId} onChange={(e) => update("templateId", e.target.value)} className={inputClass}>
              <option value="">Seleccionar plantilla...</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {templates.length === 0 && (
              <p className="text-xs text-muted mt-1">No hay plantillas. Creá una en {<Link href="/templates/new" className="text-primary">Plantillas</Link>}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} disabled={!form.name || !form.clientId || !form.projectId || !form.templateId}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg transition-all text-sm disabled:opacity-50">
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Variables */}
      {step === 2 && selectedTemplate && (
        <div className="space-y-5">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm text-foreground">
            <strong>Plantilla:</strong> {selectedTemplate.name}
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Alcance del proyecto *</label>
            <textarea value={form.scope} onChange={(e) => update("scope", e.target.value)} rows={3} placeholder="Ej: Desarrollo de una landing page responsiva con formulario de contacto..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Precio *</label>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="1500" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Moneda</label>
              <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputClass}>
                <option value="USD">USD ($)</option>
                <option value="ARS">ARS (ARS$)</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Método de pago *</label>
            <input value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)} placeholder="Ej: 50% anticipo, 50% contra entrega" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Fecha de inicio</label>
              <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Fecha de entrega</label>
              <input type="date" value={form.deliveryDate} onChange={(e) => update("deliveryDate", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Entregables</label>
            <textarea value={form.deliverables} onChange={(e) => update("deliverables", e.target.value)} rows={3} placeholder="Ej: - Código fuente del proyecto&#10;- Manual de usuario&#10;- Documentación técnica" className={inputClass} />
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground transition-all text-sm">← Atrás</button>
            <button onClick={handleGenerate} disabled={loading || !form.scope || !form.price}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {loading ? "Generando..." : "Generar contrato con IA"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 3 && loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 size={48} className="text-primary animate-spin mb-4" />
          <p className="text-lg font-semibold text-foreground">Generando contrato...</p>
          <p className="text-sm text-muted mt-1">Haiku está redactando el contrato basado en la plantilla</p>
        </div>
      )}

      {/* Step 4: Preview & Save */}
      {step === 4 && generatedContent && (
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap font-mono text-foreground">
              {generatedContent}
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground transition-all text-sm">← Volver a editar</button>
            <button onClick={handleSave} disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Guardando..." : "Guardar Contrato"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
