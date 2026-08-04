"use client";

import { IoDocumentText, IoEllipsisVertical, IoEye, IoLeaf, IoLink, IoShield, IoSparkles } from "react-icons/io5";
import type { Cuota } from "@/types/cuotas";

const icons: Record<string, React.ReactNode> = {
  cleaning: <IoSparkles size={34} />, limpieza: <IoSparkles size={34} />,
  security: <IoShield size={34} />, seguridad: <IoShield size={34} />,
  garden: <IoLeaf size={34} />, jardineria: <IoLeaf size={34} />,
  event: <IoDocumentText size={34} />, evento: <IoDocumentText size={34} />,
};
const colors: Record<string, string> = { orange: "#ffd8a6", blue: "#cfe8ff", green: "#cfeec5", purple: "#e4c8ff" };

export default function PaymentCard({ cuota, onView, onCopy }: { cuota: Cuota; onView: () => void; onCopy: () => void }) {
  const color = cuota.color_icono || "blue";
  return <article className="flex flex-col rounded-[18px] bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,.14)]">
    <div className="flex items-start justify-between">
      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] text-[#0a496a]" style={{ background: colors[color] || colors.blue }}>{icons[cuota.icono] || icons[cuota.categoria] || icons.event}</div>
      <button type="button" className="rounded-full bg-[#0a496a] p-2 text-white" aria-label="Opciones"><IoEllipsisVertical /></button>
    </div>
    <div className="text-right"><span className="rounded bg-[#cfe8ff] px-3 py-1 font-bold text-[#0a496a]">{cuota.mes.toUpperCase()}</span></div>
    <h2 className="mt-2 text-xl font-bold text-[#0a496a]">{cuota.nombre}</h2>
    <p className="min-h-12 text-sm text-[#295c7f]">{cuota.descripcion}</p>
    <div className="my-4 grid grid-cols-3 gap-2 text-[#0a496a]">
      <div><small className="font-bold text-gray-600">TIPO PAGO</small><p className="font-semibold capitalize">{cuota.tipo_pago === "unico" ? "Único" : "Mensual"}</p></div>
      <div><small className="font-bold text-gray-600">FECHA LÍMITE</small><p className="font-semibold">{new Date(`${cuota.fecha_vencimiento}T12:00:00`).toLocaleDateString("es-MX")}</p></div>
      <div className="text-right"><small className="font-bold text-gray-600">MONTO</small><p className="font-semibold">${Number(cuota.monto).toFixed(2)}</p></div>
    </div>
    <button type="button" onClick={onView} className="mb-2 flex items-center justify-center gap-2 rounded-lg bg-[#397f9f] py-3 font-bold text-white"><IoEye /> Ver pagos</button>
    <button type="button" onClick={onCopy} className="flex items-center justify-center gap-2 rounded-lg bg-[#dff1ff] py-3 font-bold text-[#0a496a]"><IoLink /> Copiar link de pago</button>
  </article>;
}
