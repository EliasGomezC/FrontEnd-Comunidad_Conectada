"use client";

import { useState } from "react";
import Button from "@/components/Button";
import type { Evento, EventoPayload } from "@/types/eventos";
import EventBaseModal from "./BaseModal";
import EventForm, { type EventFormValues } from "./EventForm";

export type EventModalMode = "create" | "edit";

interface EventModalProps {
  mode: EventModalMode;
  event?: Evento | null;
  privada: string;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (data: EventoPayload) => void;
}

const emptyValues = (): EventFormValues => ({
  titulo: "",
  tipo: "",
  fecha: "",
  hora: "",
  lugar: "",
  capacidad: "",
  descripcion: "",
  imagen: null,
});

const toValues = (event: Evento): EventFormValues => {
  const inicio = event.fecha_inicio ? new Date(event.fecha_inicio) : null;
  return {
    titulo: event.titulo,
    tipo: "",
    fecha: inicio ? inicio.toISOString().slice(0, 10) : "",
    hora: inicio
      ? `${String(inicio.getHours()).padStart(2, "0")}:${String(inicio.getMinutes()).padStart(2, "0")}`
      : "",
    lugar: event.ubicacion || "",
    capacidad: event.capacidad ? String(event.capacidad) : "",
    descripcion: event.descripcion || "",
    imagen: null,
  };
};

export default function EventModal({
  mode,
  event,
  privada,
  saving,
  onClose,
  onSubmit,
}: EventModalProps) {
  const editing = mode === "edit";
  const [values, setValues] = useState<EventFormValues>(() =>
    event ? toValues(event) : emptyValues()
  );
  const [preview, setPreview] = useState<string | null>(event?.imagen || null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const update = (patch: Partial<EventFormValues>) =>
    setValues((current) => ({ ...current, ...patch }));

  const handleImage = (file: File | null) => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    update({ imagen: file });
    setPreview(file ? URL.createObjectURL(file) : event?.imagen || null);
  };

  const handleSubmit = () => {
    const payload: EventoPayload = {
      privada: event?.privada || privada,
      titulo: values.titulo,
      descripcion: values.descripcion,
      fecha_inicio: `${values.fecha}T${values.hora}`,
      ubicacion: values.lugar,
      capacidad: values.capacidad ? Number(values.capacidad) : null,
      imagen: values.imagen || undefined,
    };
    onSubmit(payload);
  };

  return (
    <EventBaseModal
      open
      title={editing ? "Editar Evento o Proyecto" : "Crear Nuevo Evento o Proyecto"}
      subtitle={
        editing
          ? "Modifica los datos del evento."
          : "Completa los datos para registrar un nuevo evento."
      }
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ width: 220, height: 52 }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={saving}
            style={{ width: 220, height: 52 }}
          >
            {editing ? "Guardar Cambios" : "Crear Evento"}
          </Button>
        </>
      }
    >
      <EventForm
        values={values}
        onChange={update}
        preview={preview}
        onImageChange={handleImage}
      />
    </EventBaseModal>
  );
}
