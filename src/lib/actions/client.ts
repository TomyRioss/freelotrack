"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(data: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}) {
  const client = await prisma.client.create({ data });
  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

export async function updateClient(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  }
) {
  await prisma.client.update({ where: { id }, data });
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function deleteClient(id: string) {
  await prisma.client.delete({ where: { id } });
  revalidatePath("/clients");
  redirect("/clients");
}
