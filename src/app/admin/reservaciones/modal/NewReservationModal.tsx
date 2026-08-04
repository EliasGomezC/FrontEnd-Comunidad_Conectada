"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { colors } from "@/components/Modal/tokens";
import type { Area } from "@/types/areas";
import type { Reservacion, ReservacionPayload } from "@/types/reservaciones";
import BaseModal from "./BaseModal";

interface NewReservationModalProps {
  open: boolean;
  areas: Area[];
  reservations: Reservacion[];
  initial?: Reservacion | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (data: ReservacionPayload) => void;
}

type Availability = "unchecked" | "available" | "unavailable" | "incomplete";

const blankForm = (): ReservacionPayload => ({
  area: "",
  fecha: "",
  hora_inicio: "",
  hora_fin: "",
  num_asistentes: 1,
  descripcion: "",
});

const availabilityMeta: Record<Availability, { label: string; background: string; text: string }> = {
  unchecked: { label: "Sin verificar", background: colors.input, text: colors.placeholder },
  available: { label: "Disponible", background: "#BFE6AA", text: "#2E6B2E" },
  unavailable: { label: "No disponible", background: "#F6C1BA", text: "#9A2F2F" },
  incomplete: { label: "Completa el horario", background: "#FFE2B7", text: "#8A5310" },
};

export default function NewReservationModal({
  open,
  areas,
  reservations,
  initial,
  saving,
  onClose,
  onSubmit,
}: NewReservationModalProps) {
  const [form, setForm] = useState<ReservacionPayload>(() =>
    initial
      ? {
          area: initial.area,
          fecha: initial.fecha,
          hora_inicio: initial.hora_inicio.slice(0, 5),
          hora_fin: initial.hora_fin.slice(0, 5),
          num_asistentes: initial.num_asistentes,
          descripcion: initial.descripcion || "",
        }
      : blankForm()
  );
  const [availability, setAvailability] = useState<Availability>("unchecked");

  const update = (patch: Partial<ReservacionPayload>) =>
    setForm((current) => ({ ...current, ...patch }));

  const verifyAvailability = () => {
    if (!form.area || !form.fecha || !form.hora_inicio || !form.hora_fin) {
      setAvailability("incomplete");
      return;
    }
    const start = form.hora_inicio;
    const end = form.hora_fin;
    const overlap = reservations.some(
      (reservation) =>
        reservation.area === form.area &&
        reservation.fecha === form.fecha &&
        (reservation.estado === "pendiente" || reservation.estado === "aprobada") &&
        reservation.id !== initial?.id &&
        reservation.hora_inicio.slice(0, 5) < end &&
        reservation.hora_fin.slice(0, 5) > start
    );
    setAvailability(overlap ? "unavailable" : "available");
  };

  const availabilityStatus = availabilityMeta[availability];
  const editing = Boolean(initial);

  return (
    <BaseModal
      open={open}
      title={editing ? "Editar Reservación" : "Nueva Reservación"}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={verifyAvailability}
            style={{ height: 40, flex: 1 }}
          >
            Verificar disponibilidad
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit(form)}
            loading={saving}
            style={{ height: 40, flex: 1 }}
          >
            {editing ? "Guardar cambios" : "Reservar Ahora"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Select
          label="Área"
          value={form.area}
          onChange={(value) => update({ area: value })}
          options={areas.map((area) => ({ value: area.id, label: area.nombre }))}
          placeholder="Selecciona un área"
          required
          height={44}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Input
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(value) => update({ fecha: value })}
            required
            height={44}
          />
          <Input
            label="Hora inicio"
            type="time"
            value={form.hora_inicio}
            onChange={(value) => update({ hora_inicio: value })}
            required
            height={44}
          />
          <Input
            label="Hora fin"
            type="time"
            value={form.hora_fin}
            onChange={(value) => update({ hora_fin: value })}
            required
            height={44}
          />
        </div>

        <div className="flex items-end" style={{ gap: 12 }}>
          <Input
            label="Número de asistentes"
            type="number"
            min={1}
            value={String(form.num_asistentes)}
            onChange={(value) => update({ num_asistentes: value ? Number(value) : 1 })}
            required
            height={44}
            className="flex-1"
          />
          <div className="flex flex-col" style={{ flex: 1 }}>
            <span
              style={{
                display: "block",
                marginBottom: 6,
                color: colors.text,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Estado de disponibilidad
            </span>
            <div
              className="flex items-center rounded-[10px] px-3"
              style={{
                height: 44,
                background: availabilityStatus.background,
                color: availabilityStatus.text,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {availabilityStatus.label}
            </div>
          </div>
        </div>

        <Input
          label="Descripción"
          value={form.descripcion || ""}
          onChange={(value) => update({ descripcion: value })}
          placeholder="Motivo o detalles de la reservación"
          multiline
        />
      </div>
    </BaseModal>
  );
}
