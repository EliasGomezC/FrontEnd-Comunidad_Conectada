"use client";

import { useRef } from "react";
import { IoCallOutline, IoImageOutline, IoLocationOutline } from "react-icons/io5";
import type { DirectorioContacto } from "@/types/directorio";
import { colors } from "./tokens";
import ContactGallery from "./ContactGallery";
import ContactLocation from "./ContactLocation";

interface ContactDetailsProps {
  contact: DirectorioContacto;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  const images = contact.imagenes ? [contact.imagenes] : [];
  const locationRef = useRef<HTMLDivElement>(null);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {contact.imagenes ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={contact.imagenes}
            alt={contact.nombre}
            className="h-[260px] w-full rounded-2xl object-cover"
          />
        ) : (
          <div
            className="flex h-[260px] w-full items-center justify-center rounded-2xl"
            style={{
              border: `1px dashed ${colors.inputBorder}`,
              background: colors.input,
              color: colors.placeholder,
            }}
          >
            <IoImageOutline size={48} />
          </div>
        )}
        <ContactGallery images={images} size={64} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span className="inline-block w-fit rounded-lg bg-[#bfe6b5] px-3 py-1 text-sm font-medium text-[#215d2d]">
          {contact.categorias || "Sin categoría"}
        </span>

        <p className="m-0 flex items-center gap-2" style={{ color: colors.text }}>
          <IoCallOutline style={{ color: colors.primary }} />
          {contact.num_tel || "Sin número"}
        </p>

        <p className="m-0" style={{ color: colors.text, lineHeight: 1.5 }}>
          {contact.descripcion || "Sin descripción"}
        </p>

        <div ref={locationRef}>
          <ContactLocation location={contact.ubicacion} />
        </div>

        <button
          onClick={() => locationRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0a496a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#12486d]"
        >
          <IoLocationOutline size={18} />
          Ver ubicación
        </button>
      </div>
    </div>
  );
}
