"use client";

import Input from "@/components/Input";
import Select from "@/components/Select";
import ImageUploader from "@/components/ui/ImageUploader";
import GalleryInput, { type GalleryStoredImage } from "@/components/ui/GalleryInput";
import type { DirectorioPayload } from "@/types/directorio";
import { labelStyle } from "./tokens";
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
  mainImage?: string | null;
  onMainImageChange: (file: File | null) => void;
  gallery?: GalleryStoredImage[];
  onGalleryChange: (files: File[], removedIds: string[]) => void;
}

export default function ContactForm({
  form,
  onChange,
  mainImage,
  onMainImageChange,
  gallery,
  onGalleryChange,
}: ContactFormProps) {
  const isLocal = (form.tipo_ubicacion || "local") === "local";

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
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "45% 55%", gap: 16 }}>
        <Select
          label="Ubicación del servicio"
          value={form.tipo_ubicacion || "local"}
          onChange={(value) => onChange({ tipo_ubicacion: value as "local" | "externo" })}
          options={[
            { value: "local", label: "Dentro de la privada" },
            { value: "externo", label: "Fuera de la privada" },
          ]}
          required
        />
        {isLocal ? (
          <Input
            label="Número de casa"
            value={form.numero_casa || ""}
            onChange={(value) => onChange({ numero_casa: value, direccion_externa: "" })}
            placeholder="Ej. Casa 24"
            required
          />
        ) : (
          <Input
            label="Dirección"
            value={form.direccion_externa || ""}
            onChange={(value) => onChange({ direccion_externa: value, numero_casa: "" })}
            placeholder="Calle, colonia y referencia"
            required
          />
        )}
      </div>

      <Input
        label="Descripción"
        value={form.descripcion || ""}
        onChange={(value) => onChange({ descripcion: value })}
        placeholder="Breve descripción del contacto"
        multiline
      />

      <div>
        <span style={labelStyle}>Imagen principal</span>
        <ImageUploader image={mainImage} onChange={onMainImageChange} height={160} />
      </div>

      <div>
        <span style={labelStyle}>Galería de imágenes</span>
        <GalleryInput images={gallery} onChange={onGalleryChange} />
      </div>

      <div>
        <span style={labelStyle}>Ubicación</span>
        <div style={{ display: "grid", gap: 12 }}>
          {!isLocal && (
            <Input
              label="Link de Google Maps"
              value={form.maps_url || ""}
              onChange={(value) => onChange({ maps_url: value })}
              placeholder="https://maps.google.com/..."
            />
          )}
          <ContactLocation
            location={isLocal ? `Dentro de la privada · Casa ${form.numero_casa || "..."}` : form.direccion_externa}
            mapsUrl={!isLocal ? form.maps_url : undefined}
          />
        </div>
      </div>
    </div>
  );
}
