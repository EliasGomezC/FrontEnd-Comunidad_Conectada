"use client";

import { IoMapOutline } from "react-icons/io5";
import { colors } from "./tokens";

interface ContactLocationProps {
  location?: string;
}

export default function ContactLocation({ location }: ContactLocationProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        height: 120,
        width: "100%",
        borderRadius: 12,
        border: `1px dashed ${colors.inputBorder}`,
        background: colors.input,
        gap: 8,
      }}
    >
      <IoMapOutline size={28} style={{ color: colors.primary }} />
      <span style={{ fontSize: 13, color: colors.placeholder }}>
        {location?.trim() ? location : "Ubicación del contacto"}
      </span>
    </div>
  );
}
