"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function createContract(data: {
  name: string;
  clientId: string;
  projectId: string;
  templateId?: string;
  content: string;
  value?: number;
  currency?: string;
  status?: string;
}) {
  const contract = await prisma.contract.create({
    data: {
      name: data.name,
      clientId: data.clientId,
      projectId: data.projectId,
      templateId: data.templateId,
      content: data.content,
      value: data.value || null,
      currency: data.currency || "USD",
      status: data.status || "DRAFT",
    },
  });
  revalidatePath("/contracts");
  redirect(`/contracts/${contract.id}`);
}

export async function updateContractStatus(id: string, status: string) {
  await prisma.contract.update({
    where: { id },
    data: { status, signedAt: status === "SIGNED" ? new Date() : undefined },
  });
  revalidatePath(`/contracts/${id}`);
  revalidatePath("/contracts");
}

export async function deleteContract(id: string) {
  await prisma.contract.delete({ where: { id } });
  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function generateContractContent(data: {
  templateContent: string;
  clientName: string;
  projectName: string;
  scope: string;
  price: string;
  currency: string;
  paymentMethod: string;
  startDate: string;
  deliveryDate: string;
  deliverables: string;
}) {
  const prompt = `Genera un contrato profesional en español basado en esta plantilla:

--- PLANTILLA ---
${data.templateContent}
--- FIN PLANTILLA ---

Datos del contrato:
- Cliente: ${data.clientName}
- Proyecto: ${data.projectName}
- Alcance: ${data.scope}
- Precio: ${data.currency === "ARS" ? "ARS$" : "$"}${data.price}
- Método de pago: ${data.paymentMethod}
- Fecha de inicio: ${data.startDate}
- Fecha de entrega: ${data.deliveryDate}
- Entregables: ${data.deliverables}

IMPORTANTE:
1. Mantené EXACTAMENTE las mismas secciones y cláusulas legales de la plantilla
2. Reemplazá SOLO los valores variables con los datos proporcionados
3. NO cambiés la redacción legal ni las cláusulas
4. Devolvé solo el contrato completo en markdown, sin explicaciones ni comentarios`;

  const result = await execPromise(
    `claude -p ${JSON.stringify(prompt)} --model haiku --max-turns 1 --allowedTools "" 2>&1`
  );

  return result;
}
