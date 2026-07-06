import { prisma } from "@/lib/prisma";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED";

export async function getProjects(status?: ProjectStatus) {
  return prisma.project.findMany({
    where: status ? { status } : {},
    include: {
      client: true,
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      tasks: { orderBy: { createdAt: "desc" } },
      contracts: true,
    },
  });
}

export async function getClients() {
  return prisma.client.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
