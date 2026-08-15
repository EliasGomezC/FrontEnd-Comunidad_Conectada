"use client";

import { useState } from "react";
import { colors } from "@/components/Modal/tokens";
import type { Area } from "@/types/areas";
import type { Reservacion } from "@/types/reservaciones";
import BaseModal from "./BaseModal";
import ReservationGallery from "./ReservationGallery";
import ReservationStatus, { backendToStatus } from "./ReservationStatus";
import ReservationFooter from "./ReservationFooter";

interface ReservationDetailsModalProps {
  open: boolean;
  reservation: Reservacion | null;
  areas: Area[];
  solicitante?: string;
  saving?: boolean;
  onClose: () => void;
  onSolicitarCambios: () => void;
  onRechazar: () => void;
  onAprobar: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span
        style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.placeholder }}
      >
        {label}
      </span>
      <span style={{ fontSize: 15, color: colors.text, fontWeight: 500 }}>
        {value || "—"}
      </span>
    </div>
  );
}

export default function ReservationDetailsModal({
  open,
  reservation,
  areas,
  solicitante,
  saving,
  onClose,
  onSolicitarCambios,
  onRechazar,
  onAprobar,
}: ReservationDetailsModalProps) {
  const status = backendToStatus[reservation?.estado ?? ""] ?? "pending";
  const [nota, setNota] = useState("");

  return (
    <BaseModal open={open} title="Detalle Reservación" onClose={onClose}>
      {reservation && (
        <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InfoRow
                label="Área"
                value={areas.find((area) => area.id === reservation.area)?.nombre || reservation.area}
              />
              <InfoRow label="Solicitante" value={solicitante || "Habitante"} />
              <InfoRow label="Fecha" value={reservation.fecha} />
              <InfoRow
                label="Horario"
                value={`${reservation.hora_inicio.slice(0, 5)} – ${reservation.hora_fin.slice(0, 5)}`}
              />
              <InfoRow label="Invitados" value={String(reservation.num_asistentes)} />
              <InfoRow label="Folio" value={`#${reservation.folio}`} />
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  marginBottom: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                Imágenes
              </span>
              <ReservationGallery />
            </div>
          </div>

          <div
            className="flex flex-col justify-between"
            style={{ height: "100%", gap: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <span
                  style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text }}
                >
                  Contexto
                </span>
                <p className="m-0 mt-1" style={{ color: colors.text, lineHeight: 1.5, fontSize: 15 }}>
                  {reservation.descripcion || "Sin contexto"}
                </p>
              </div>

              <div>
                <span
                  style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text }}
                >
                  Nota del moderador
                </span>
                <textarea
                  value={nota}
                  onChange={(event) => setNota(event.target.value)}
                  placeholder="Escribe una nota para el habitante..."
                  className="mt-1 w-full placeholder:text-[#9AA5B1]"
                  style={{
                    minHeight: 88,
                    borderRadius: 10,
                    border: `1px solid ${colors.inputBorder}`,
                    background: colors.input,
                    color: colors.text,
                    fontSize: 15,
                    padding: "12px 14px",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ReservationStatus status={status} />
              <ReservationFooter
                status={status}
                saving={saving}
                onCerrar={onClose}
                onSolicitarCambios={onSolicitarCambios}
                onRechazar={onRechazar}
                onAprobar={onAprobar}
              />
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
