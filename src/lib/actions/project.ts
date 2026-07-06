"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const clientId = formData.get("clientId") as string;
  const budget = formData.get("budget") as string;
  const currency = formData.get("currency") as string;
  const deadline = formData.get("deadline") as string;
  const status = formData.get("status") as string;

  if (!name || !clientId) throw new Error("El nombre y el cliente son obligatorios");

  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      clientId,
      budget: budget ? parseFloat(budget) : null,
      currency: currency || "USD",
      deadline: deadline ? new Date(deadline) : null,
      status: status || "ACTIVE",
    },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const budget = formData.get("budget") as string;
  const currency = formData.get("currency") as string;
  const deadline = formData.get("deadline") as string;
  const status = formData.get("status") as string;

  if (!name) throw new Error("El nombre es obligatorio");

  await prisma.project.update({
    where: { id },
    data: {
      name,
      description: description || null,
      budget: budget ? parseFloat(budget) : null,
      currency: currency || "USD",
      deadline: deadline ? new Date(deadline) : null,
      status: status || "ACTIVE",
    },
  });

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  await prisma.project.update({ where: { id }, data: { status } });
  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  redirect("/projects");
}
