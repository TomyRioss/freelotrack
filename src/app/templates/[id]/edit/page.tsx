import { getTemplate } from "@/lib/queries/template";
import { notFound } from "next/navigation";
import { EditTemplateForm } from "./edit-form";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getTemplate(id);
  if (!template) notFound();
  return <EditTemplateForm template={template} />;
}
