"use client";

import ObjectCard from "@/components/ObjectCard";
import { LuPackage } from "react-icons/lu";
import type { LostObject } from "../data";

interface FoundSectionProps {
  items: LostObject[];
  headerColor: string;
  panelColor: string;
  showCheck?: boolean;
}

export default function FoundSection({ items, headerColor, panelColor, showCheck = false }: FoundSectionProps) {
  return (
    <section className="min-w-0 flex-1">
      {/* Banner exterior */}
      <div className={`${headerColor} rounded-t-xl px-3 py-2`}>
        {/* Cápsula de texto/icono */}
        <div className="inline-flex items-center gap-2 bg-[#FEDFE4] px-3 py-1 rounded-full shadow-sm">
          <LuPackage className="text-xl text-amber-900" />
          <h2 className="text-base font-bold text-gray-900">Objetos resguardados</h2>
        </div>
      </div>
    
      {/* Contenedor del panel */}
      <div className={`${panelColor} h-auto md:h-[calc(100vh-290px)] min-h-[260px] overflow-x-hidden overflow-y-auto rounded-b-xl p-4 shadow-sm`}>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No hay objetos resguardados</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 pr-1 sm:grid-cols-2">
            {items.map((item) => (
              <ObjectCard key={item.id} item={item} showCheck={showCheck} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}