import { prisma } from "@/lib/prisma";

export async function getClients() {
  return prisma.client.findMany({
    include: {
      _count: { select: { projects: true, contracts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getClient(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      projects: { include: { contracts: true, tasks: true } },
      contracts: { include: { payments: true } },
    },
  });
}
