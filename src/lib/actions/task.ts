"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createTask(projectId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!title) {
    throw new Error("El título es obligatorio");
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function toggleTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new Error("Tarea no encontrada");

  await prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });

  revalidatePath(`/projects/${task.projectId}`);
}

export async function deleteTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new Error("Tarea no encontrada");

  await prisma.task.delete({ where: { id } });

  revalidatePath(`/projects/${task.projectId}`);
}
