"use client";

import Input from "@/components/Input";
import Select from "@/components/Select";
import type { DirectorioPayload } from "@/types/directorio";
import { labelStyle } from "./tokens";
import ContactGallery from "./ContactGallery";
import ContactLocation from "./ContactLocation";

const CATEGORIES = [
  "Plomería",
  "Electricidad",
  "Limpieza",
  "Transporte",
  "Alimentos",
  "Seguridad",
  "Jardinería",
  "Carpintería",
  "Mascotas",
  "Otro",
];

interface ContactFormProps {
  form: DirectorioPayload;
  onChange: (patch: Partial<DirectorioPayload>) => void;
  images: string[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
}

export default function ContactForm({
  form,
  onChange,
  images,
  onAddImages,
  onRemoveImage,
}: ContactFormProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input
        label="Nombre"
        value={form.nombre}
        onChange={(value) => onChange({ nombre: value })}
        placeholder="Nombre del contacto"
        required
      />

      <div style={{ display: "grid", gridTemplateColumns: "45% 55%", gap: 16 }}>
        <Select
          label="Categoría"
          value={form.categorias}
          onChange={(value) => onChange({ categorias: value })}
          options={CATEGORIES.map((category) => ({
            value: category,
            label: category,
          }))}
          placeholder="Selecciona una categoría"
          required
        />
        <Input
          label="Número"
          value={form.num_tel}
          onChange={(value) => onChange({ num_tel: value })}
          placeholder="Número de contacto"
        />
      </div>

      <Input
        label="Descripción"
        value={form.descripcion || ""}
        onChange={(value) => onChange({ descripcion: value })}
        placeholder="Breve descripción del contacto"
        multiline
      />

      <div>
        <span style={labelStyle}>Galería de imágenes</span>
        <ContactGallery
          images={images}
          editable
          onAdd={onAddImages}
          onRemove={onRemoveImage}
        />
      </div>

      <div>
        <span style={labelStyle}>Ubicación</span>
        <ContactLocation location={form.ubicacion} />
      </div>
    </div>
  );
}
