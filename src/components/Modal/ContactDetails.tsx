"use client";

import { useRef } from "react";
import { IoCallOutline, IoImageOutline, IoLocationOutline } from "react-icons/io5";
import type { DirectorioContacto } from "@/types/directorio";
import { colors } from "./tokens";
import GalleryDisplay from "@/components/ui/GalleryDisplay";
import ContactLocation from "./ContactLocation";

interface ContactDetailsProps {
  contact: DirectorioContacto;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  const locationRef = useRef<HTMLDivElement>(null);
  const locationSummary = contact.tipo_ubicacion === "externo"
    ? contact.direccion_externa || contact.ubicacion
    : `Dentro de la privada · Casa ${contact.numero_casa || "sin especificar"}`;

  return (
    <div className="grid gap-8 md:grid-cols-2">
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
        <GalleryDisplay images={contact.galeria} size={64} />
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
          <ContactLocation location={locationSummary} mapsUrl={contact.maps_url} compact />
        </div>

        <div className="flex flex-wrap gap-3">
          {contact.num_tel && (
            <a
              href={`tel:${contact.num_tel}`}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#0a496a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#12486d]"
            >
              <IoCallOutline size={18} />
              Llamar
            </a>
          )}
          <button
            onClick={() => locationRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
            className="flex w-fit items-center gap-2 rounded-xl bg-sky-100 px-5 py-2.5 font-semibold text-[#0a496a] transition hover:bg-sky-200"
          >
            <IoLocationOutline size={18} />
            Ver ubicación
          </button>
        </div>
      </div>
    </div>
  );
}
