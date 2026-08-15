"use client";

import Button from "@/components/Button";
import type { ReservationStatusType } from "./ReservationStatus";

interface ReservationFooterProps {
  status: ReservationStatusType;
  saving?: boolean;
  onCerrar: () => void;
  onSolicitarCambios: () => void;
  onRechazar: () => void;
  onAprobar: () => void;
}

export default function ReservationFooter({
  status,
  saving,
  onCerrar,
  onSolicitarCambios,
  onRechazar,
  onAprobar,
}: ReservationFooterProps) {
  if (status !== "pending") {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <Button variant="primary" onClick={onCerrar} style={{ height: 40, flex: 1 }}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <Button
        variant="secondary"
        onClick={onSolicitarCambios}
        style={{ height: 40, width: "100%" }}
      >
        Solicitar Cambios
      </Button>
      <Button
        variant="danger"
        onClick={onRechazar}
        loading={saving}
        style={{ height: 40, width: "100%" }}
      >
        Rechazar
      </Button>
      <Button
        variant="primary"
        onClick={onAprobar}
        loading={saving}
        style={{ height: 40, width: "100%" }}
      >
        Aprobar
      </Button>
    </div>
  );
}
