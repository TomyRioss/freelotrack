import { prisma } from "@/lib/prisma";

export async function getTemplates() {
  return prisma.contractTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getTemplate(id: string) {
  return prisma.contractTemplate.findUnique({ where: { id } });
}
