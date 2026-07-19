"use client";

import ObjectCard from "@/components/ObjectCard";
import type { LostObject } from "../data";

interface LostSectionProps {
  items: LostObject[];
  headerColor: string;
  panelColor: string;
  showCheck?: boolean;
}

export default function LostSection({ items, headerColor, panelColor, showCheck = false }: LostSectionProps) {
  return (
    <section className="flex-1 min-w-0">
      <div className={`${headerColor} rounded-t-xl px-5 py-3`}>
        <h2 className="text-white text-base font-semibold">Objetos extraviados</h2>
      </div>
      <div className={`${panelColor} rounded-b-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]`}>
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No hay objetos extraviados</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <ObjectCard key={item.id} item={item} showCheck={showCheck} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
