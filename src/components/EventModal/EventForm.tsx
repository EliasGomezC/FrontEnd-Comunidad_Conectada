"use client";

import Input from "@/components/Input";
import Select from "@/components/Select";
import FormSection from "@/components/ui/FormSection";
import GalleryInput, { type GalleryStoredImage } from "@/components/ui/GalleryInput";
import ImageUploader from "./ImageUploader";

export interface EventFormValues {
  titulo: string;
  tipo: string;
  fecha: string;
  hora: string;
  lugar: string;
  capacidad: string;
  descripcion: string;
  imagen: File | null;
}

const TIPOS = [
  "Reunión",
  "Taller",
  "Actividad social",
  "Deportivo",
  "Cultural",
  "Comunitario",
  "Otro",
];

interface EventFormProps {
  values: EventFormValues;
  onChange: (patch: Partial<EventFormValues>) => void;
  preview?: string | null;
  onImageChange: (file: File | null) => void;
  gallery?: GalleryStoredImage[];
  onGalleryChange: (files: File[], removedIds: string[]) => void;
}

export default function EventForm({
  values,
  onChange,
  preview,
  onImageChange,
  gallery,
  onGalleryChange,
}: EventFormProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Input
        label="Título del Evento"
        value={values.titulo}
        onChange={(value) => onChange({ titulo: value })}
        placeholder="Nombre del evento"
        required
        height={52}
        radius={12}
        paddingX={16}
      />

      <Select
        label="Tipo"
        value={values.tipo}
        onChange={(value) => onChange({ tipo: value })}
        options={TIPOS.map((tipo) => ({ value: tipo, label: tipo }))}
        placeholder="Selecciona un tipo"
        required
        height={52}
        radius={12}
        paddingX={16}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Input
          label="Fecha"
          type="date"
          value={values.fecha}
          onChange={(value) => onChange({ fecha: value })}
          required
          height={52}
          radius={12}
          paddingX={16}
        />
        <Input
          label="Hora"
          type="time"
          value={values.hora}
          onChange={(value) => onChange({ hora: value })}
          required
          height={52}
          radius={12}
          paddingX={16}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Input
          label="Lugar / Instalación"
          value={values.lugar}
          onChange={(value) => onChange({ lugar: value })}
          placeholder="Lugar del evento"
          required
          height={52}
          radius={12}
          paddingX={16}
        />
        <Input
          label="Capacidad máxima"
          type="number"
          min={1}
          value={values.capacidad}
          onChange={(value) => onChange({ capacidad: value })}
          placeholder="Número de personas"
          height={52}
          radius={12}
          paddingX={16}
        />
      </div>

      <Input
        label="Descripción"
        value={values.descripcion}
        onChange={(value) => onChange({ descripcion: value })}
        placeholder="Describe el evento"
        multiline
        height={140}
        radius={12}
        paddingX={16}
      />

      <FormSection label="Imagen principal">
        <ImageUploader image={preview} onChange={onImageChange} />
      </FormSection>

      <FormSection label="Galería de imágenes">
        <GalleryInput images={gallery} onChange={onGalleryChange} />
      </FormSection>
    </div>
  );
}
