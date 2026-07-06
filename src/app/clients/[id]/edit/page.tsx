import { notFound } from "next/navigation";
import { getClient } from "@/lib/queries/client";
import { updateClient } from "@/lib/actions/client";
import { EditClientForm } from "./edit-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: Props) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return (
    <EditClientForm
      clientId={client.id}
      defaultValues={{
        name: client.name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        company: client.company ?? "",
        notes: client.notes ?? "",
      }}
    />
  );
}
