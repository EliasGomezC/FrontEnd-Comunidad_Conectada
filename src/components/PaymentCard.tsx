"use client";

import {
  IoSparkles, IoShield, IoLeaf, IoDocumentText, IoEllipsisVertical,
} from "react-icons/io5";
import type { Payment } from "@/app/admin/pagos/payments";

interface PaymentCardProps {
  payment: Payment;
}

const iconMap: Record<string, React.ReactNode> = {
  cleaning: <IoSparkles size={34} color="#a35100" />,
  security: <IoShield size={34} color="#005a8a" />,
  garden: <IoLeaf size={34} color="#1b5e20" />,
  event: <IoDocumentText size={34} color="#6a1b9a" />,
};

const colorStyles: Record<string, { iconBg: string; badgeBg: string; badgeText: string }> = {
  orange: { iconBg: "#ffd8a6", badgeBg: "#ffe0b8", badgeText: "#a35100" },
  blue: { iconBg: "#cfe8ff", badgeBg: "#cfe8ff", badgeText: "#005a8a" },
  green: { iconBg: "#cfeec5", badgeBg: "#cfeec5", badgeText: "#1b5e20" },
  purple: { iconBg: "#e4c8ff", badgeBg: "#e4c8ff", badgeText: "#6a1b9a" },
};

export default function PaymentCard({ payment }: PaymentCardProps) {
  const colors = colorStyles[payment.color];

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex flex-col">
      <div className="flex justify-between items-start">
        <div
          className="w-[70px] h-[70px] rounded-[18px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.iconBg }}
        >
          {iconMap[payment.icon]}
        </div>
        <button className="w-[38px] h-[38px] rounded-full bg-[#0a496a] flex items-center justify-center text-white shrink-0">
          <IoEllipsisVertical size={18} />
        </button>
      </div>

      <div className="text-right mt-2">
        <span
          className="inline-block px-[14px] py-[6px] rounded-[8px] font-bold text-sm"
          style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}
        >
          {payment.month}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mt-2 mb-1">{payment.title}</h2>
      <p className="text-sm text-gray-500 mb-4">{payment.description}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <p className="text-xs font-bold text-gray-700 uppercase">Tipo</p>
          <p className="text-sm text-gray-600">{payment.paymentType}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-700 uppercase">Fecha</p>
          <p className="text-sm text-gray-600">{payment.dueDate}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-700 uppercase">Monto</p>
          <p className="text-sm text-gray-600">${payment.amount.toFixed(2)}</p>
        </div>
      </div>

      <button className="w-full py-3 rounded-[10px] font-bold text-white bg-[#0a496a] hover:bg-[#0d5a80] mb-2">
        Ver pagos
      </button>
      <button className="w-full py-3 rounded-[10px] font-bold bg-[#d8edf9] text-[#0a496a] hover:bg-[#c0e0f0]">
        Copiar link de pago
      </button>
    </div>
  );
}
