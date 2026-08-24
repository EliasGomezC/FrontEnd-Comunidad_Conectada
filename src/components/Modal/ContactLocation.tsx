"use client";

import { IoLocationOutline, IoMapOutline } from "react-icons/io5";
import { colors } from "./tokens";

interface ContactLocationProps {
  location?: string;
  mapsUrl?: string;
  compact?: boolean;
}

export default function ContactLocation({ location, mapsUrl, compact = false }: ContactLocationProps) {
  return (
    <div
      className="flex w-full flex-col rounded-xl"
      style={{
        minHeight: compact ? 88 : 120,
        border: `1px dashed ${colors.inputBorder}`,
        background: colors.input,
        padding: 16,
        gap: 10,
      }}
    >
      <div className="flex items-center gap-2" style={{ color: colors.primary }}>
        <IoMapOutline size={22} />
        <strong>{mapsUrl ? "Ubicación con Maps" : "Ubicación"}</strong>
      </div>
      <div className="flex items-start gap-2 text-sm" style={{ color: colors.text }}>
        <IoLocationOutline className="mt-0.5 shrink-0" />
        <span>{location?.trim() ? location : "Ubicación del contacto"}</span>
      </div>
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="w-fit rounded-lg bg-[#0a496a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12486d]"
        >
          Abrir en Maps
        </a>
      )}
    </div>
  );
}
