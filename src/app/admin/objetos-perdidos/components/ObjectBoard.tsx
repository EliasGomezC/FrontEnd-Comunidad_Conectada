"use client";

import LostSection from "./LostSection";
import FoundSection from "./FoundSection";
import ObjectCard from "@/components/ObjectCard";
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
      <section>
        <div className={`${palette.all.header} rounded-t-xl px-5 py-3`}>
          <h2 className="text-white text-base font-semibold">Objetos extraviados / resguardados</h2>
        </div>
        <div className={`${palette.all.panel} rounded-b-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allItems.map((item) => (
              <ObjectCard key={item.id} item={item} showCheck />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
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
