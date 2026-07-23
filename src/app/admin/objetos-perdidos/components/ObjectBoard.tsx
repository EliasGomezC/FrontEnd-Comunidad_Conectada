"use client";

import LostSection from "./LostSection";
import FoundSection from "./FoundSection";
import ObjectCard from "@/components/ObjectCard";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import type { LostObject } from "../data";

interface ObjectBoardProps {
  lostItems: LostObject[];
  foundItems: LostObject[];
  allItems: LostObject[];
  view: "active" | "completed" | "all";
  palette: {
    active: { lost: { header: string; panel: string }; found: { header: string; panel: string }; tabBorder: string };
    completed: { lost: { header: string; panel: string }; found: { header: string; panel: string }; tabBorder: string };
    all: { header: string; panel: string; tabBorder: string };
  };
}

export default function ObjectBoard({ lostItems, foundItems, allItems, view, palette }: ObjectBoardProps) {
  if (view === "all") {
    return (
      <section className="flex h-full min-w-0 flex-1 flex-col">
        {/* Banner exterior unificado */}
        <div className={`${palette.all.header} rounded-t-xl px-3 py-2`}>
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
            <IoSearchOutline className="text-xl text-gray-900" />
            <h2 className="text-base font-bold text-gray-900">Objetos extraviados/resguardados</h2>
          </div>
        </div>

        {/* Panel general con fondo amarillo claro */}
        <div className={`${palette.all.panel} min-h-0 flex-1 overflow-y-auto rounded-b-xl p-4 shadow-sm`}>
          {allItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No hay objetos para mostrar</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {allItems.map((item) => (
                <div key={item.id} className="relative">
                  <ObjectCard item={item} />
                  {item.status === "completed" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <IoCheckmarkCircle className="size-24 text-green-600/90 drop-shadow-md" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <LostSection
        items={lostItems}
        headerColor={palette[view].lost.header}
        panelColor={palette[view].lost.panel}
      />
      <FoundSection
        items={foundItems}
        headerColor={palette[view].found.header}
        panelColor={palette[view].found.panel}
      />
    </div>
  );
}
