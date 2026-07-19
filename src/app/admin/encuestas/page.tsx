import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { IoBarChart, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

interface Survey {
  id: number;
  title: string;
  status: "Activa" | "Inactiva" | "Finalizada" | "Cancelada";
  responses: number;
  progress: number;
  startDate: string;
  endDate: string;
}

const surveys: Survey[] = [
  { id: 1, title: "Opinión sobre las áreas verdes", status: "Activa", responses: 35, progress: 70, startDate: "20 Abril 2026", endDate: "28 Abril 2026" },
  { id: 2, title: "Día de junta", status: "Inactiva", responses: 0, progress: 2, startDate: "20 Abril 2024", endDate: "28 Abril 2024" },
  { id: 3, title: "Acciones sobre Bache", status: "Finalizada", responses: 50, progress: 100, startDate: "20 Abril 2024", endDate: "28 Abril 2024" },
  { id: 4, title: "Propuestas de Talleres", status: "Cancelada", responses: 48, progress: 85, startDate: "20 Abril 2024", endDate: "28 Abril 2024" },
  { id: 5, title: "Color nuevo de la Privada", status: "Finalizada", responses: 50, progress: 100, startDate: "10 Enero 2024", endDate: "26 Enero 2026" },
];

const EncuestasPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Encuestas" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="text-[52px] m-0 text-[#124b70]">Encuestas</h1>
            <SearchBar placeholder="Buscar..." className="w-[500px] max-w-full mt-3" />
          </div>
          <button className="bg-[#0a496a] text-white border-none px-[24px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80]">
            + Crear Encuesta
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-[20px] p-5 flex justify-between gap-5 items-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            >
              <div className="flex-1">
                <h2 className="inline text-xl text-slate-900">{survey.title}</h2>
                <StatusBadge status={survey.status} className="ml-5" />
                <div className="mt-2">
                  <strong>{survey.responses} Respuestas</strong>
                </div>
                <div className="h-[6px] bg-[#ddd] rounded-[4px] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-[#1d8cff] rounded-[4px]"
                    style={{ width: `${survey.progress}%` }}
                  />
                </div>
                <div className="mt-2">
                  <strong>Inicio</strong> {survey.startDate} &nbsp;&nbsp;
                  <strong>Fin</strong> {survey.endDate}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-1 px-[14px] py-[8px] border-none rounded-[8px] cursor-pointer bg-[#bfe2ff] hover:bg-[#a8d5ff] text-sm">
                  <IoBarChart size={16} className="shrink-0" /> Ver Resultados
                </button>
                <button className="flex items-center gap-1 px-[14px] py-[8px] border-none rounded-[8px] cursor-pointer bg-[#ffd79c] hover:bg-[#ffcc80] text-sm">
                  <IoPencilOutline size={16} className="shrink-0" /> Editar
                </button>
                <button className="flex items-center gap-1 px-[14px] py-[8px] border-none rounded-[8px] cursor-pointer bg-[#f3b0aa] hover:bg-[#ff9b9b] text-sm">
                  <IoTrashOutline size={16} className="shrink-0" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EncuestasPage;
