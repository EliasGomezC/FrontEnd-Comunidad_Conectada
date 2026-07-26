"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getObjetosPerdidos } from "@/services/objetos-perdidos";
import { ObjetoPerdido } from "@/types/objetos-perdidos";
import { IoReload } from "react-icons/io5";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ObjectTabs from "./components/ObjectTabs";
import ObjectBoard from "./components/ObjectBoard";

const palette = {
  active: {
    lost: {
      header: "bg-[#0a496a]",
      panel: "bg-[#e8f0fe]",
    },
    found: {
      header: "bg-[#e65100]",
      panel: "bg-[#fff3e0]",
    },
    tabBorder: "shadow-[inset_0_-3px_0_#0a496a]",
  },
  completed: {
    lost: {
      header: "bg-[#1b5e20]",
      panel: "bg-[#e8f5e9]",
    },
    found: {
      header: "bg-[#4caf50]",
      panel: "bg-[#f1f8e9]",
    },
    tabBorder: "shadow-[inset_0_-3px_0_#2d8a4e]",
  },
  all: {
    header: "bg-[#b8860b]",
    panel: "bg-[#fff8e1]",
    tabBorder: "shadow-[inset_0_-3px_0_#b8860b]",
  },
};

const ObjetosPerdidosPage = () => {
  const { token, logout, activeMembership } = useAuth();
  const [objetos, setObjetos] = useState<ObjetoPerdido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "all">("active");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token || !activeMembership) return;

    const fetchObjetos = async () => {
      try {
        setIsLoading(true);
        const data = await getObjetosPerdidos(token, { privada: activeMembership.privada });
        setObjetos(data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar objetos");
        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjetos();
  }, [token, logout, activeMembership]);

  const filteredByStatus = useMemo(() => {
    return objetos.filter((obj) => {
      const objStatus = obj.fecha_devuelto ? "completed" : "active";
      if (activeTab === "active") return objStatus === "active";
      if (activeTab === "completed") return objStatus === "completed";
      return true;
    });
  }, [objetos, activeTab]);

  const filteredBySearch = useMemo(() => {
    if (!searchTerm) return filteredByStatus;
    const term = searchTerm.toLowerCase();
    return filteredByStatus.filter(
      (obj) =>
        obj.nombre.toLowerCase().includes(term) ||
        obj.descripcion.toLowerCase().includes(term)
    );
  }, [filteredByStatus, searchTerm]);

  const lostItems = useMemo(
    () => filteredBySearch.filter((obj) => obj.tipo === "perdido"),
    [filteredBySearch]
  );

  const foundItems = useMemo(
    () => filteredBySearch.filter((obj) => obj.tipo === "encontrado"),
    [filteredBySearch]
  );

  const mapToObjectCard = (obj: ObjetoPerdido) => {
    return {
      id: obj.id,
      title: obj.nombre,
      description: obj.descripcion,
      date: obj.fecha_reporte ? new Date(`${obj.fecha_reporte}T12:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "Sin fecha",
      owner: obj.reportado_por ? `Usuario #${obj.reportado_por}` : "Desconocido",
      image: obj.imagen || "",
      type: (obj.tipo === "perdido" ? "lost" : "found") as "lost" | "found",
      status: (obj.fecha_devuelto ? "completed" : "active") as "active" | "completed",
    };
  };

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Objetos Perdidos" />

      <main className="flex-1 p-[30px]">
        <h1 className="text-[52px] m-0 text-[#124b70]">Objetos Perdidos</h1>
        <p className="text-[#677e8c] mb-6">Administración de objetos extraviados/resguardados</p>

        <div className="flex items-center gap-4 mb-6">
          <SearchBar 
            placeholder="Buscar objeto..." 
            className="flex-1 max-w-[500px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-[#0a496a] text-white border-none px-[24px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80] whitespace-nowrap">
            + Nuevo objeto
          </button>
          <ObjectTabs activeTab={activeTab} onTabChange={setActiveTab} palette={palette} />
          <button className="ml-auto p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <IoReload size={18} />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#0a496a] text-xl">Cargando objetos...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <ObjectBoard
            lostItems={lostItems.map(mapToObjectCard)}
            foundItems={foundItems.map(mapToObjectCard)}
            allItems={objetos.map(mapToObjectCard)}
            view={activeTab}
            palette={palette}
          />
        )}
      </main>
    </div>
  );
};

export default ObjetosPerdidosPage;
