"use client";

import type { NextPage } from "next";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { IoCheckmarkCircleOutline, IoClose, IoDocumentTextOutline, IoImageOutline, IoLocationOutline } from "react-icons/io5";

interface Report {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  status: "PENDIENTE" | "CONCLUIDO";
  userId: number;
  image?: string;
}

interface ResidentInfo {
  fullName: string;
  houseNumber: string;
  phoneNumber: string;
}

interface NewReportForm {
  title: string;
  type: string;
  priority: string;
  date: string;
  time: string;
  description: string;
}

const currentUserId = 1;

const ReportesPage: NextPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState<"all" | "mine">("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isConfirmingCompletion, setIsConfirmingCompletion] = useState(false);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [residentInfo] = useState<ResidentInfo>({ fullName: "", houseNumber: "", phoneNumber: "" });
  const [newReport, setNewReport] = useState<NewReportForm>({
    title: "",
    type: "",
    priority: "",
    date: "",
    time: "",
    description: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewReportForm, string>>>({});

  const visibleReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports
      .filter((report) => activeView === "all" || report.userId === currentUserId)
      .filter((report) =>
        [report.title, report.category, report.location, report.description]
          .some((value) => value.toLowerCase().includes(normalizedSearch)),
      );
  }, [activeView, reports, search]);

  const closeDetailsModal = () => {
    setSelectedReport(null);
    setIsConfirmingCompletion(false);
  };

  const confirmCompletion = () => {
    if (!selectedReport || selectedReport.status === "CONCLUIDO") return;

    const completedReport = { ...selectedReport, status: "CONCLUIDO" as const };
    setReports((previousReports) =>
      previousReports.map((report) =>
        report.id === completedReport.id ? completedReport : report,
      ),
    );
    setSelectedReport(completedReport);
    setIsConfirmingCompletion(false);
  };

  const closeNewReportModal = () => {
    setIsNewReportModalOpen(false);
    setFormErrors({});
  };

  const updateNewReport = (field: keyof NewReportForm, value: string) => {
    setNewReport((currentReport) => ({ ...currentReport, [field]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImages(event.target.files ? Array.from(event.target.files) : []);
  };

  const handleCreateReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields: Array<keyof NewReportForm> = ["title", "type", "priority", "date", "description"];
    const errors = requiredFields.reduce<Partial<Record<keyof NewReportForm, string>>>((currentErrors, field) => {
      if (!newReport[field].trim()) currentErrors[field] = "Este campo es obligatorio.";
      return currentErrors;
    }, {});

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // La llamada al servicio de reportes se integrará aquí cuando el endpoint esté disponible.
    // Los archivos seleccionados ya están preparados para enviarse como FormData.
  };

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Reportes" />

      <main className="min-w-0 flex-1 p-5 sm:p-[30px]">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="m-0 text-4xl font-bold tracking-wide text-[#124b70] sm:text-[52px]">REPORTES</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Consulta y administra los reportes registrados por los habitantes de la comunidad.
            </p>
            <SearchBar
              placeholder="Buscar reporte..."
              onSearch={setSearch}
              className="mt-4 w-full max-w-[500px]"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsNewReportModalOpen(true)}
            className="rounded-[14px] bg-[#0a496a] px-5 py-3 font-medium text-white transition-colors hover:bg-[#0d5a80] sm:px-6 sm:py-4"
          >
            + Nuevo Reporte
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3" role="tablist" aria-label="Vistas de reportes">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "all"}
            onClick={() => setActiveView("all")}
            className={`rounded-xl px-5 py-2.5 font-medium transition-colors ${
              activeView === "all"
                ? "bg-[#0a496a] text-white shadow-sm"
                : "bg-white text-[#0a496a] hover:bg-slate-100"
            }`}
          >
            Todos los reportes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "mine"}
            onClick={() => setActiveView("mine")}
            className={`rounded-xl px-5 py-2.5 font-medium transition-colors ${
              activeView === "mine"
                ? "bg-[#0a496a] text-white shadow-sm"
                : "bg-white text-[#0a496a] hover:bg-slate-100"
            }`}
          >
            Mis reportes
          </button>
        </div>

        {visibleReports.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[20px] bg-white px-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <IoDocumentTextOutline className="mb-4 h-16 w-16 text-[#75a5be]" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-wide text-[#124b70]">NO HAY REPORTES REGISTRADOS</h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Actualmente no existen reportes disponibles para mostrar.
            </p>
          </section>
        ) : (
          <section className="flex flex-col gap-4" aria-label="Lista de reportes">
            {visibleReports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedReport(report)}
                className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">{report.title}</h2>
                    <span className="rounded-lg bg-[#c8f0bf] px-3 py-1 text-sm text-[#215d2d]">{report.category}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                    <span>Fecha: {report.date}</span>
                    <span className="flex items-center gap-1"><IoLocationOutline aria-hidden="true" /> {report.location}</span>
                  </div>
                </div>
                <span className={`w-fit rounded-lg px-3 py-1 text-sm font-semibold ${
                  report.status === "PENDIENTE" ? "bg-[#ffd79c] text-[#8a6a00]" : "bg-[#c8f0bf] text-[#215d2d]"
                }`}>
                  {report.status}
                </span>
              </button>
            ))}
          </section>
        )}
      </main>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="report-details-title">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0a496a]">Detalle del reporte</p>
                <h2 id="report-details-title" className="mt-1 text-2xl font-bold text-slate-900">{selectedReport.title}</h2>
              </div>
              <button type="button" onClick={closeDetailsModal} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Cerrar detalles">
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <p><span className="block text-sm text-slate-500">Categoría</span><span className="font-medium text-slate-900">{selectedReport.category}</span></p>
              <p><span className="block text-sm text-slate-500">Fecha</span><span className="font-medium text-slate-900">{selectedReport.date}</span></p>
              <p><span className="block text-sm text-slate-500">Ubicación</span><span className="font-medium text-slate-900">{selectedReport.location}</span></p>
              <p><span className="block text-sm text-slate-500">Estado</span><span className={`inline-block rounded-lg px-3 py-1 text-sm font-semibold ${selectedReport.status === "PENDIENTE" ? "bg-[#ffd79c] text-[#8a6a00]" : "bg-[#c8f0bf] text-[#215d2d]"}`}>{selectedReport.status}</span></p>
            </div>

            <div className="mt-5">
              <p className="text-sm text-slate-500">Descripción</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-800">{selectedReport.description}</p>
            </div>
            {selectedReport.image && (
              <img src={selectedReport.image} alt={`Evidencia de ${selectedReport.title}`} className="mt-5 max-h-72 w-full rounded-xl object-cover" />
            )}

            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={closeDetailsModal} className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100">Cerrar</button>
              {selectedReport.status === "PENDIENTE" && (
                <button type="button" onClick={() => setIsConfirmingCompletion(true)} className="flex items-center gap-2 rounded-xl bg-[#0a496a] px-5 py-2.5 font-medium text-white hover:bg-[#0d5a80]">
                  <IoCheckmarkCircleOutline className="h-5 w-5" /> Marcar como concluido
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedReport && isConfirmingCompletion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="confirmation-title" className="text-xl font-bold text-slate-900">¿Marcar reporte como concluido?</h2>
            <p className="mt-3 text-slate-600">¿Estás seguro de que deseas marcar este reporte como concluido?</p>
            <p className="mt-2 font-medium text-slate-900">{selectedReport.title}</p>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setIsConfirmingCompletion(false)} className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100">Cancelar</button>
              <button type="button" onClick={confirmCompletion} className="rounded-xl bg-[#0a496a] px-5 py-2.5 font-medium text-white hover:bg-[#0d5a80]">Sí, marcar como concluido</button>
            </div>
          </div>
        </div>
      )}

      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="new-report-title">
          <form onSubmit={handleCreateReport} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 id="new-report-title" className="text-2xl font-bold text-[#124b70]">Nuevo Reporte</h2>
                <p className="mt-1 text-slate-600">Completa los datos para crear un nuevo reporte.</p>
              </div>
              <button type="button" onClick={closeNewReportModal} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Cerrar formulario">
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            <section className="mt-6">
              <h3 className="text-lg font-bold text-[#124b70]">Datos del residente</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-medium text-slate-700">Nombre completo
                  <input value={residentInfo.fullName} readOnly placeholder="Disponible al iniciar sesión" className="mt-1.5 w-full rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-3 text-slate-500 outline-none placeholder:text-slate-400" />
                </label>
                <label className="text-sm font-medium text-slate-700">Número de casa
                  <input value={residentInfo.houseNumber} readOnly placeholder="Disponible al iniciar sesión" className="mt-1.5 w-full rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-3 text-slate-500 outline-none placeholder:text-slate-400" />
                </label>
                <label className="text-sm font-medium text-slate-700">Número de teléfono
                  <input value={residentInfo.phoneNumber} readOnly placeholder="Disponible al iniciar sesión" className="mt-1.5 w-full rounded-[10px] border border-slate-200 bg-slate-100 px-3 py-3 text-slate-500 outline-none placeholder:text-slate-400" />
                </label>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-lg font-bold text-[#124b70]">Información general</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-medium text-slate-700 md:col-span-3">Título del reporte
                  <input value={newReport.title} onChange={(event) => updateNewReport("title", event.target.value)} className={`mt-1.5 w-full rounded-[10px] border bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-[#0a496a] focus:ring-2 focus:ring-[#bfe2ff] ${formErrors.title ? "border-red-500" : "border-slate-300"}`} />
                  {formErrors.title && <span className="mt-1 block text-xs text-red-600">{formErrors.title}</span>}
                </label>
                <label className="text-sm font-medium text-slate-700">Tipo de reporte
                  <select value={newReport.type} onChange={(event) => updateNewReport("type", event.target.value)} className={`mt-1.5 w-full rounded-[10px] border bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-[#0a496a] focus:ring-2 focus:ring-[#bfe2ff] ${formErrors.type ? "border-red-500" : "border-slate-300"}`}>
                    <option value="">Selecciona una opción</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {formErrors.type && <span className="mt-1 block text-xs text-red-600">{formErrors.type}</span>}
                </label>
                <label className="text-sm font-medium text-slate-700">Prioridad
                  <select value={newReport.priority} onChange={(event) => updateNewReport("priority", event.target.value)} className={`mt-1.5 w-full rounded-[10px] border bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-[#0a496a] focus:ring-2 focus:ring-[#bfe2ff] ${formErrors.priority ? "border-red-500" : "border-slate-300"}`}>
                    <option value="">Selecciona una opción</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                  {formErrors.priority && <span className="mt-1 block text-xs text-red-600">{formErrors.priority}</span>}
                </label>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-lg font-bold text-[#124b70]">Detalles del suceso</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">Fecha del suceso
                  <input type="date" value={newReport.date} onChange={(event) => updateNewReport("date", event.target.value)} className={`mt-1.5 w-full rounded-[10px] border bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-[#0a496a] focus:ring-2 focus:ring-[#bfe2ff] ${formErrors.date ? "border-red-500" : "border-slate-300"}`} />
                  {formErrors.date && <span className="mt-1 block text-xs text-red-600">{formErrors.date}</span>}
                </label>
                <label className="text-sm font-medium text-slate-700">Hora aproximada
                  <input type="time" value={newReport.time} onChange={(event) => updateNewReport("time", event.target.value)} className="mt-1.5 w-full rounded-[10px] border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-[#0a496a] focus:ring-2 focus:ring-[#bfe2ff]" />
                </label>
                <label className="text-sm font-medium text-slate-700 md:col-span-2">Descripción detallada
                  <textarea value={newReport.description} onChange={(event) => updateNewReport("description", event.target.value)} rows={4} className={`mt-1.5 w-full resize-y rounded-[10px] border bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-[#0a496a] focus:ring-2 focus:ring-[#bfe2ff] ${formErrors.description ? "border-red-500" : "border-slate-300"}`} />
                  {formErrors.description && <span className="mt-1 block text-xs text-red-600">{formErrors.description}</span>}
                </label>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="text-lg font-bold text-[#124b70]">Evidencia multimedia</h3>
              <label className="mt-3 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#75a5be] bg-[#f5f9fc] px-5 py-6 text-center transition hover:bg-[#eaf3f8]">
                <IoImageOutline className="h-9 w-9 text-[#0a496a]" />
                <span className="mt-2 font-medium text-[#124b70]">Arrastra o selecciona imágenes</span>
                <span className="mt-1 text-sm text-slate-500">Puedes seleccionar varios archivos.</span>
                <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="sr-only" />
              </label>
              {selectedImages.length > 0 && <p className="mt-2 text-sm text-slate-600">{selectedImages.length} imagen{selectedImages.length === 1 ? "" : "es"} seleccionada{selectedImages.length === 1 ? "" : "s"}.</p>}
            </section>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
              <button type="button" onClick={closeNewReportModal} className="rounded-[10px] border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100">Cancelar</button>
              <button type="submit" className="rounded-[10px] bg-[#0a496a] px-5 py-3 font-medium text-white transition hover:bg-[#0d5a80]">Crear Reporte</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReportesPage;
