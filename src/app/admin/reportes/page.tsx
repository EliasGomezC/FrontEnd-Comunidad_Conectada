"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getReportes } from "@/services/reportes";
import { Reporte } from "@/types/reportes";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { IoDocumentText, IoDownloadOutline } from "react-icons/io5";

const estadoMap: Record<string, "Generado" | "Pendiente" | "Programado"> = {
  pendiente: "Pendiente",
  en_proceso: "Programado",
  resuelto: "Generado",
  cerrado: "Generado",
};

const ReportesPage = () => {
  const { token, logout } = useAuth();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchReportes = async () => {
      try {
        setIsLoading(true);
        const data = await getReportes(token);
        setReportes(data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar reportes");
        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportes();
  }, [token, logout]);

  const filteredReportes = useMemo(() => {
    if (!searchTerm) return reportes;
    const term = searchTerm.toLowerCase();
    return reportes.filter(
      (reporte) =>
        reporte.descripcion.toLowerCase().includes(term) ||
        reporte.tipo.toLowerCase().includes(term) ||
        reporte.ubicacion?.toLowerCase().includes(term)
    );
  }, [reportes, searchTerm]);

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Reportes" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="text-[52px] m-0 text-[#124b70]">Reportes</h1>
            <SearchBar 
              placeholder="Buscar reporte..." 
              className="w-[500px] max-w-full mt-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#0a496a] text-white border-none px-[24px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80]">
            + Generar Reporte
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#0a496a] text-xl">Cargando reportes...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col gap-4 mt-6">
            {filteredReportes.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-[20px] p-5 flex justify-between gap-5 items-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              >
                <div className="flex-1">
                  <h2 className="text-xl inline">{report.descripcion}</h2>
                  <span className="ml-3 px-3 py-1 rounded-[8px] bg-[#c8f0bf] text-[#215d2d] text-sm">
                    {report.tipo}
                  </span>
                  <p className="mt-2 text-sm text-slate-900">
                    Creado: {new Date(report.fecha_reporte).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-[8px] text-sm font-semibold ${
                      estadoMap[report.estado] === "Generado"
                        ? "bg-[#bfe2ff] text-[#0a496a]"
                        : estadoMap[report.estado] === "Pendiente"
                        ? "bg-[#ffd79c] text-[#8a6a00]"
                        : "bg-[#e0e0e0] text-[#555]"
                    }`}
                  >
                    {estadoMap[report.estado] || "Pendiente"}
                  </span>
                  <button className="flex items-center gap-1 px-[14px] py-[8px] border-none rounded-[8px] cursor-pointer bg-[#0a496a] text-white hover:bg-[#0d5a80] text-sm">
                    <IoDownloadOutline size={16} className="shrink-0" /> Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportesPage;
