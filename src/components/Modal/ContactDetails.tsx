"use client";

import { IoCallOutline, IoImageOutline } from "react-icons/io5";
import type { DirectorioContacto } from "@/types/directorio";
import { colors } from "./tokens";
import ContactGallery from "./ContactGallery";
import ContactLocation from "./ContactLocation";

interface ContactDetailsProps {
  contact: DirectorioContacto;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  const images = contact.imagenes ? [contact.imagenes] : [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {contact.imagenes ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={contact.imagenes}
            alt={contact.nombre}
            style={{
              width: 170,
              height: 170,
              objectFit: "cover",
              borderRadius: 12,
              display: "block",
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              width: 170,
              height: 170,
              borderRadius: 12,
              border: `1px dashed ${colors.inputBorder}`,
              background: colors.input,
              color: colors.placeholder,
            }}
          >
            <IoImageOutline size={40} />
          </div>
        )}
        <ContactGallery images={images} size={50} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>
            Categoría
          </span>
          <span
            className="inline-block rounded px-2 py-1 text-sm"
            style={{ background: colors.success, color: "#215D2D", marginTop: 6 }}
          >
            {contact.categorias || "Sin categoría"}
          </span>
        </div>

        <p className="m-0 flex items-center gap-2" style={{ color: colors.text }}>
          <IoCallOutline style={{ color: colors.primary }} />
          {contact.num_tel || "Sin número"}
        </p>

        <p className="m-0" style={{ color: colors.text, lineHeight: 1.5 }}>
          {contact.descripcion || "Sin descripción"}
        </p>

        <ContactLocation location={contact.ubicacion} />
      </div>
    </div>
  );
}
