"use client";

import { IoWarningOutline } from "react-icons/io5";
import Button from "@/components/Button";
import type { DirectorioContacto } from "@/types/directorio";
import { colors } from "./tokens";

interface DeleteConfirmationProps {
  contact: DirectorioContacto;
  onCancel: () => void;
  onConfirm: () => void;
  saving?: boolean;
}

export default function DeleteConfirmation({
  contact,
  onCancel,
  onConfirm,
  saving,
}: DeleteConfirmationProps) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 20, padding: "8px 0 4px" }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.15)",
          color: colors.danger,
        }}
      >
        <IoWarningOutline size={36} />
      </div>

      <h2
        className="m-0 text-[22px] font-bold"
        style={{ color: colors.title, textAlign: "center" }}
      >
        Eliminar Contacto
      </h2>

      <p
        className="m-0"
        style={{
          color: colors.text,
          fontSize: 15,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        ¿Estás seguro de que deseas eliminar el contacto{" "}
        <strong>{contact.nombre}</strong>? Esta acción no se puede deshacer.
      </p>

      <div style={{ display: "flex", gap: 12, width: "100%" }}>
        <Button variant="secondary" onClick={onCancel} style={{ flex: 1 }}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={saving} style={{ flex: 1 }}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
