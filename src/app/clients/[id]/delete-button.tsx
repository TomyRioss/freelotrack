"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteClient } from "@/lib/actions/client";

interface DeleteClientButtonProps {
  clientId: string;
  clientName: string;
}

export function DeleteClientButton({
  clientId,
  clientName,
}: DeleteClientButtonProps) {
  const deleteWithId = deleteClient.bind(null, clientId);

  return (
    <form
      action={deleteWithId}
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Estás seguro de eliminar a "${clientName}"? Esta acción no se puede deshacer.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 size={14} />
        Eliminar Cliente
      </Button>
    </form>
  );
}
