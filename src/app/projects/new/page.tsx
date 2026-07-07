import { getClients } from "@/lib/queries/project";
import { NewProjectForm } from "./new-project-form";

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const clients = await getClients();
  return <NewProjectForm clients={clients} />;
}
