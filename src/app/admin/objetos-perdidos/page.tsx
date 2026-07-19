"use client";

import { useState, useMemo } from "react";
import { IoReload } from "react-icons/io5";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ObjectTabs from "./components/ObjectTabs";
import ObjectBoard from "./components/ObjectBoard";
import objects from "./data";

const palette = {
  active: {
    lost: { header: "bg-[#0a496a]", panel: "bg-[#e8f0fe]" },
    found: { header: "bg-[#e65100]", panel: "bg-[#fff3e0]" },
    tabBorder: "shadow-[inset_0_-3px_0_#0a496a]",
  },
  completed: {
    lost: { header: "bg-[#1b5e20]", panel: "bg-[#e8f5e9]" },
    found: { header: "bg-[#4caf50]", panel: "bg-[#f1f8e9]" },
    tabBorder: "shadow-[inset_0_-3px_0_#2d8a4e]",
  },
  all: {
    header: "bg-[#b8860b]",
    panel: "bg-[#fff8e1]",
    tabBorder: "shadow-[inset_0_-3px_0_#b8860b]",
  },
};

export default function ObjetosPerdidosPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "all">("active");

  const filteredByStatus = useMemo(
    () =>
      objects.filter((obj) => {
        if (activeTab === "active") return obj.status === "active";
        if (activeTab === "completed") return obj.status === "completed";
        return true;
      }),
    [activeTab],
  );

  const lostItems = useMemo(
    () => filteredByStatus.filter((obj) => obj.type === "lost"),
    [filteredByStatus],
  );

  const foundItems = useMemo(
    () => filteredByStatus.filter((obj) => obj.type === "found"),
    [filteredByStatus],
  );

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Objetos Perdidos" />

      <main className="flex-1 p-[30px]">
        <h1 className="text-[52px] m-0 text-[#124b70]">Objetos Perdidos</h1>
        <p className="text-[#677e8c] mb-6">Administración de objetos extraviados/resguardados</p>

        <div className="flex items-center gap-4 mb-6">
          <SearchBar placeholder="Buscar objeto..." className="flex-1 max-w-[500px]" />
          <button className="bg-[#0a496a] text-white border-none px-[24px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80] whitespace-nowrap">
            + Nuevo objeto
          </button>
          <ObjectTabs activeTab={activeTab} onTabChange={setActiveTab} palette={palette} />
          <button className="ml-auto p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <IoReload size={18} />
          </button>
        </div>

        <ObjectBoard
          lostItems={lostItems}
          foundItems={foundItems}
          allItems={objects}
          view={activeTab}
          palette={palette}
        />
      </main>
    </div>
  );
}
