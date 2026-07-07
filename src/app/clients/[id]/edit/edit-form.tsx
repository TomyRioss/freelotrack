"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { updateClient } from "@/lib/actions/client";

interface EditClientFormProps {
  clientId: string;
  defaultValues: {
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
  };
}

export function EditClientForm({ clientId, defaultValues }: EditClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await updateClient(clientId, {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/clients/${clientId}`}>
          <Button variant="ghost" size="icon" className="text-muted hover:text-foreground">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Editar Cliente</h1>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre *</label>
              <Input name="name" value={formData.name} onChange={handleChange} required className="bg-surface border-border text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-surface border-border text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-surface border-border text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Empresa</label>
              <Input name="company" value={formData.company} onChange={handleChange} className="bg-surface border-border text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notas</label>
              <Textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="bg-surface border-border text-foreground" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Link href={`/clients/${clientId}`}>
                <Button type="button" variant="outline" className="border-border">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
