import { getClients } from "@/lib/queries/client";
import { getProjects } from "@/lib/queries/project";
import { getTemplates } from "@/lib/queries/template";
import { ContractWizard } from "./contract-wizard";

export const dynamic = 'force-dynamic';

export default async function NewContractPage() {
  const [clients, projects, templates] = await Promise.all([
    getClients(),
    getProjects(),
    getTemplates(),
  ]);

  return (
    <ContractWizard
      clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      templates={templates.map((t) => ({ id: t.id, name: t.name, content: t.content }))}
    />
  );
}
