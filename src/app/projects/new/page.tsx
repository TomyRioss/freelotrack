import { getClients } from "@/lib/queries/project";
import { NewProjectForm } from "./new-project-form";

export default async function NewProjectPage() {
  const clients = await getClients();
  return <NewProjectForm clients={clients} />;
}
