import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const now = new Date();
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeProjects, upcomingDeadlines, monthlyIncome, pendingPayments, recentContracts] =
    await Promise.all([
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.project.findMany({
        where: { deadline: { gte: now, lte: sevenDays }, status: "ACTIVE" },
        include: { client: true },
        orderBy: { deadline: "asc" },
        take: 5,
      }),
      prisma.payment.aggregate({
        where: { status: "PAID", paidAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.contract.findMany({
        include: { client: true, project: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <DashboardClient
      activeProjects={activeProjects}
      upcomingDeadlines={upcomingDeadlines.map((p) => ({
        id: p.id,
        name: p.name,
        clientName: p.client.name,
        deadline: p.deadline!.toISOString(),
      }))}
      monthlyIncome={monthlyIncome._sum.amount ?? 0}
      pendingPayments={pendingPayments._sum.amount ?? 0}
      recentContracts={recentContracts.map((c) => ({
        id: c.id,
        name: c.name,
        clientName: c.client.name,
        status: c.status,
        value: c.value ?? 0,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
