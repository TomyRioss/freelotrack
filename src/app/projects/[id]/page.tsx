import { getProject } from "@/lib/queries/project";
import { getClients } from "@/lib/queries/project";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./project-detail-client";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, clients] = await Promise.all([
    getProject(id),
    getClients(),
  ]);

  if (!project) notFound();

  const serialized = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    deadline: project.deadline?.toISOString() ?? null,
    tasks: project.tasks.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      dueDate: t.dueDate?.toISOString() ?? null,
    })),
    contracts: project.contracts.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      signedAt: c.signedAt?.toISOString() ?? null,
    })),
  };

  return <ProjectDetailClient project={serialized} clients={clients} />;
}
