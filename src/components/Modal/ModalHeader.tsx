"use client";

import { IoClose } from "react-icons/io5";
import { colors } from "./tokens";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "24px 24px 16px",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <h2 className="m-0 text-[22px] font-bold" style={{ color: colors.title }}>
        {title}
      </h2>
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
