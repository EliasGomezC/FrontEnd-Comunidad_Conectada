"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getReservaciones } from "@/services/reservaciones";
import { Reservacion } from "@/types/reservaciones";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { IoEyeOutline } from "react-icons/io5";

const estadoMap: Record<string, "Aprobado" | "Pendiente" | "Rechazado" | "Completado"> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  completado: "Completado",
  cancelado: "Rechazado",
};

const ReservacionesPage = () => {
  const { token, logout } = useAuth();
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchReservaciones = async () => {
      try {
        setIsLoading(true);
        const data = await getReservaciones(token);
        setReservaciones(data.results);
        setTotalPages(Math.ceil(data.count / 10));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar reservaciones");
        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservaciones();
  }, [token, logout]);

  const filteredReservaciones = useMemo(() => {
    if (!searchTerm) return reservaciones;
    const term = searchTerm.toLowerCase();
    return reservaciones.filter(
      (reservacion) =>
        reservacion.area_nombre?.toLowerCase().includes(term) ||
        reservacion.solicitante_nombre?.toLowerCase().includes(term) ||
        reservacion.notas?.toLowerCase().includes(term)
    );
  }, [reservaciones, searchTerm]);

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Reservaciones" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="m-0 text-[52px] text-[#124b70]">Gestión de Reservaciones</h1>
            <p className="m-0 text-[18px] text-[#295c7f]">Consulta y administra las reservaciones de la comunidad</p>
            <SearchBar 
              placeholder="Buscar por reservación o usuario" 
              className="w-[560px] max-w-full mt-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#0a496a] text-white border-none p-4 rounded-[14px] cursor-pointer hover:bg-[#0d5a80] text-lg">
            ＋ Nueva Reservación
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#0a496a] text-xl">Cargando reservaciones...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="mt-6 bg-white rounded-[0_0_30px_30px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.12)] border-2 border-[#2b6a8b]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#0a496a] text-white">
                    <th className="p-[18px] text-left">Área</th>
                    <th className="p-[18px] text-left">Fecha</th>
                    <th className="p-[18px] text-left">Horario</th>
                    <th className="p-[18px] text-left">Solicitante</th>
                    <th className="p-[18px] text-left">Estado</th>
                    <th className="p-[18px] text-left">Más</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservaciones.map((reservation, index) => (
                    <tr
                      key={reservation.id}
                      className={`${index % 2 === 0 ? "bg-[#eef2f6]" : "bg-white"}`}
                    >
                      <td className="p-4 text-slate-900">{reservation.area_nombre || `Área ${reservation.area}`}</td>
                      <td className="p-4 text-slate-900">
                        {new Date(reservation.fecha).toLocaleDateString("es-ES")}
                      </td>
                      <td className="p-4 text-slate-900">
                        {reservation.hora_inicio} - {reservation.hora_fin}
                      </td>
                      <td className="p-4 text-slate-900">
                        {reservation.solicitante_nombre || `Usuario ${reservation.solicitante}`}
                      </td>
                      <td className="p-4 text-slate-900">
                        <StatusBadge status={estadoMap[reservation.estado] || "Pendiente"} />
                      </td>
                      <td className="p-4 text-slate-900">
                        <IoEyeOutline size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReservacionesPage;
