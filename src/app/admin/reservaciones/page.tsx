import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { IoEyeOutline } from "react-icons/io5";

interface Reservation {
  id: number;
  area: string;
  date: string;
  timeSlot: string;
  requester: string;
  status: "Aprobado" | "Pendiente" | "Rechazado" | "Completado";
}

const reservations: Reservation[] = [
  { id: 1, area: "Área 1", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Aprobado" },
  { id: 2, area: "Área 2", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Aprobado" },
  { id: 3, area: "Área 3", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Aprobado" },
  { id: 4, area: "Área 4", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Pendiente" },
  { id: 5, area: "Área 2", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Pendiente" },
  { id: 6, area: "Área 4", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Rechazado" },
  { id: 7, area: "Área 3", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Rechazado" },
  { id: 8, area: "Área 1", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Completado" },
  { id: 9, area: "Área 4", date: "28/Enero/2026", timeSlot: "14:00 - 18:00", requester: "Usuario123", status: "Completado" },
];

const ReservacionesPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Reservaciones" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="m-0 text-[52px] text-[#124b70]">Gestión de Reservaciones</h1>
            <p className="m-0 text-[18px] text-[#295c7f]">Consulta y administra las reservaciones de la comunidad</p>
            <SearchBar placeholder="Buscar por reservación o usuario" className="w-[560px] max-w-full mt-3" />
          </div>
          <button className="bg-[#0a496a] text-white border-none p-4 rounded-[14px] cursor-pointer hover:bg-[#0d5a80] text-lg">
            ＋ Nueva Reservación
          </button>
        </div>

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
              {reservations.map((reservation, index) => (
                <tr
                  key={reservation.id}
                  className={`${index % 2 === 0 ? "bg-[#eef2f6]" : "bg-white"}`}
                >
                  <td className="p-4 text-slate-900">{reservation.area}</td>
                  <td className="p-4 text-slate-900">{reservation.date}</td>
                  <td className="p-4 text-slate-900">{reservation.timeSlot}</td>
                  <td className="p-4 text-slate-900">{reservation.requester}</td>
                  <td className="p-4 text-slate-900">
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td className="p-4 text-slate-900"><IoEyeOutline size={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={1} totalPages={10} />
        </div>
      </main>
    </div>
  );
};

export default ReservacionesPage;
