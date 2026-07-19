"use client";

import type { NextPage } from "next";

interface StatusBadgeProps {
  status: "Activa" | "Inactiva" | "Finalizada" | "Cancelada" | "Aprobado" | "Pendiente" | "Rechazado" | "Completado" | "Moderador" | "Habitante";
  className?: string;
}

const statusColors: Record<string, string> = {
  Activa: "bg-[#9ad28a]",
  Inactiva: "bg-[#ffd08a]",
  Finalizada: "bg-[#a9d6f5]",
  Cancelada: "bg-[#f5b2aa]",
  Aprobado: "bg-[#b7e3a5]",
  Pendiente: "bg-[#ffd79c]",
  Rechazado: "bg-[#f3b0aa]",
  Completado: "bg-[#bcc7ff]",
  Moderador: "bg-[#bcc7ff]",
  Habitante: "bg-[#ffd79c]",
};

const statusTextColors: Record<string, string> = {
  Activa: "text-[#215d2d]",
  Inactiva: "text-[#8a6a00]",
  Finalizada: "text-[#0a496a]",
  Cancelada: "text-[#8a2020]",
  Aprobado: "text-[#215d2d]",
  Pendiente: "text-[#8a6a00]",
  Rechazado: "text-[#8a2020]",
  Completado: "text-[#1e3a8a]",
  Moderador: "text-[#1e3a8a]",
  Habitante: "text-[#8a6a00]",
};

const StatusBadge: NextPage<StatusBadgeProps> = ({ status, className = "" }) => {
  return (
    <span
      className={`inline-block p-2 px-4 rounded-[8px] font-semibold ${statusColors[status] || "bg-gray-300"} ${statusTextColors[status] || "text-slate-900"} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
