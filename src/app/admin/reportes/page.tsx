import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { IoDocumentText, IoDownloadOutline } from "react-icons/io5";

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: "Generado" | "Pendiente" | "Programado";
}

const reports: Report[] = [
  { id: 1, title: "Reporte de ingresos mensuales", type: "Finanzas", date: "15 Jun 2026", status: "Generado" },
  { id: 2, title: "Reporte de morosidad", type: "Finanzas", date: "10 Jun 2026", status: "Generado" },
  { id: 3, title: "Reporte de visitas recibidas", type: "Visitantes", date: "05 Jun 2026", status: "Pendiente" },
  { id: 4, title: "Reporte de incidencias", type: "Seguridad", date: "01 Jun 2026", status: "Generado" },
  { id: 5, title: "Reporte de encuestas semestral", type: "Encuestas", date: "28 May 2026", status: "Programado" },
];

const ReportesPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Reportes" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="text-[52px] m-0 text-[#124b70]">Reportes</h1>
            <SearchBar placeholder="Buscar reporte..." className="w-[500px] max-w-full mt-3" />
          </div>
          <button className="bg-[#0a496a] text-white border-none px-[24px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80]">
            + Generar Reporte
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-[20px] p-5 flex justify-between gap-5 items-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            >
              <div className="flex-1">
                <h2 className="text-xl inline">{report.title}</h2>
                <span className="ml-3 px-3 py-1 rounded-[8px] bg-[#c8f0bf] text-[#215d2d] text-sm">
                  {report.type}
                </span>
                <p className="mt-2 text-sm text-slate-900">Creado: {report.date}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-[8px] text-sm font-semibold ${
                  report.status === "Generado" ? "bg-[#bfe2ff] text-[#0a496a]" :
                  report.status === "Pendiente" ? "bg-[#ffd79c] text-[#8a6a00]" :
                  "bg-[#e0e0e0] text-[#555]"
                }`}>
                  {report.status}
                </span>
                <button className="flex items-center gap-1 px-[14px] py-[8px] border-none rounded-[8px] cursor-pointer bg-[#0a496a] text-white hover:bg-[#0d5a80] text-sm">
                  <IoDownloadOutline size={16} className="shrink-0" /> Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReportesPage;
