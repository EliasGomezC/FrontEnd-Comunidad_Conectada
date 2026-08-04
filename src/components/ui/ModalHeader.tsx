"use client";

import { IoClose } from "react-icons/io5";
import { colors } from "@/components/Modal/tokens";

interface ModalHeaderProps {
  title?: string;
  subtitle?: string;
  titleSize?: number | string;
  subtitleSize?: number | string;
  subtitleColor?: string;
  padding?: number | string;
  onClose: () => void;
}

export default function ModalHeader({
  title,
  subtitle,
  titleSize = 22,
  subtitleSize = 16,
  subtitleColor = "#6B7280",
  padding = "24px",
  onClose,
}: ModalHeaderProps) {
  const pad = typeof padding === "number" ? `${padding}px` : padding;

  return (
    <div
      className="flex items-start justify-between"
      style={{ padding: `${pad} ${pad} 16px`, borderBottom: `1px solid ${colors.border}` }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {title && (
          <h2 className="m-0 font-bold" style={{ color: colors.title, fontSize: titleSize, lineHeight: 1.15 }}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="m-0" style={{ color: subtitleColor, fontSize: subtitleSize, lineHeight: 1.4 }}>
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-slate-100"
        style={{ color: colors.text }}
      >
        <IoClose size={24} />
      </button>
    </div>
  );
}
