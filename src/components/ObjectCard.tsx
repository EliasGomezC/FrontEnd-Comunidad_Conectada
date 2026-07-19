"use client";

import { IoEllipsisVertical, IoCube, IoCheckmarkCircle } from "react-icons/io5";
import type { LostObject } from "@/app/admin/objetos-perdidos/data";

interface ObjectCardProps {
  item: LostObject;
  showCheck?: boolean;
}

export default function ObjectCard({ item, showCheck = false }: ObjectCardProps) {
  return (
    <div className="bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex flex-col relative min-w-[220px] overflow-hidden">
      <div className="flex justify-between items-start px-4 pt-4 pb-2">
        <span className="text-xs text-gray-500">{item.date}</span>
        <button className="w-7 h-7 rounded-full bg-[#0a496a] flex items-center justify-center text-white shrink-0">
          <IoEllipsisVertical size={14} />
        </button>
      </div>

      <div className="relative px-4 mb-2">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-32 rounded-lg bg-[#d9e7f3] flex items-center justify-center">
            <IoCube size={48} color="#12486d" />
          </div>
        )}
        {showCheck && item.type === "found" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IoCheckmarkCircle size={48} className="text-green-500" />
          </div>
        )}
      </div>

      <div className="px-4 pb-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
      </div>

      <div className="flex justify-end px-4 pb-4 mt-auto">
        <span className="text-xs text-gray-600 truncate max-w-[140px]">{item.owner}</span>
      </div>
    </div>
  );
}
