"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTemplate(data: {
  name: string;
  description?: string;
  content: string;
}) {
  const template = await prisma.contractTemplate.create({ data });
  revalidatePath("/templates");
  redirect(`/templates`);
}

export async function updateTemplate(
  id: string,
  data: { name?: string; description?: string; content?: string }
) {
  await prisma.contractTemplate.update({ where: { id }, data });
  revalidatePath("/templates");
  redirect("/templates");
}

export async function deleteTemplate(id: string) {
  await prisma.contractTemplate.delete({ where: { id } });
  revalidatePath("/templates");
  redirect("/templates");
}
