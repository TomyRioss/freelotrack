import { prisma } from "@/lib/prisma";

export async function getContracts() {
  return prisma.contract.findMany({
    include: { client: true, project: true, template: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getContract(id: string) {
  return prisma.contract.findUnique({
    where: { id },
    include: {
      client: true,
      project: true,
      template: true,
      payments: { orderBy: { dueDate: "asc" } },
    },
  });
}
