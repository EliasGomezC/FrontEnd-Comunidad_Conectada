"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { createEvento, deleteEvento, getEventos, updateEvento } from "@/services/eventos";
import type { Evento, EventoPayload } from "@/types/eventos";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import EventModal from "@/components/EventModal";
import { IoAdd, IoCalendarOutline, IoImageOutline, IoLocationOutline, IoPeopleOutline } from "react-icons/io5";

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  proximo: { label: "Próximo", bg: "bg-[#c9e8ff]", text: "text-[#0a496a]" },
  en_curso: { label: "En curso", bg: "bg-[#ffd79c]", text: "text-[#8a6a00]" },
  en_progreso: { label: "En curso", bg: "bg-[#ffd79c]", text: "text-[#8a6a00]" },
  activo: { label: "Activo", bg: "bg-[#b7e3a5]", text: "text-[#215d2d]" },
  finalizado: { label: "Finalizado", bg: "bg-[#b7e3a5]", text: "text-[#215d2d]" },
  completado: { label: "Finalizado", bg: "bg-[#b7e3a5]", text: "text-[#215d2d]" },
  cancelado: { label: "Cancelado", bg: "bg-[#f5b2aa]", text: "text-[#8a2020]" },
};

const eventBadge = (status: string) =>
  STATUS_BADGES[status] ?? {
    label: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    bg: "bg-[#dbeafe]",
    text: "text-[#0a496a]",
  };

export default function EventosPage() {
  const { token, user } = useAuth();
  const privada = user?.membresias?.[0]?.privada || "";
  const [items, setItems] = useState<Evento[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getEventos(token, { search: search || undefined, page });
      setItems(data.results);
      setCount(data.count);
      setError(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron cargar los eventos."); }
    finally { setLoading(false); }
  }, [token, search, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la carga asíncrona actualiza el estado al resolver la API.
    void load();
  }, [load]);

  const openNew = () => { setSelectedEvent(null); setModal("create"); };
  const openEdit = (item: Evento) => { setSelectedEvent(item); setModal("edit"); };
  const close = () => { setModal(null); setSelectedEvent(null); };

  const submit = async (data: EventoPayload) => {
    if (!token) return;
    setSaving(true); setError(null);
    try {
      if (selectedEvent) await updateEvento(token, selectedEvent.id, data);
      else await createEvento(token, data);
      close(); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar el evento."); }
    finally { setSaving(false); }
  };

  const remove = async (id?: string) => {
    if (!token || !id || !window.confirm("¿Eliminar este evento?")) return;
    setSaving(true); setError(null);
    try { await deleteEvento(token, id); close(); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo eliminar el evento."); }
    finally { setSaving(false); }
  };

  const totalPages = Math.max(1, Math.ceil(count / 20));

  return <div className="flex min-h-screen bg-[#eef2f7]"><Sidebar activeItem="Eventos" /><main className="flex-1 p-[30px]">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
      <div>
        <h1 className="m-0 text-[52px] leading-tight text-[#124b70]">Eventos y Proyectos</h1>
        <p className="m-0 text-[18px] text-[#295c7f]">Gestiona las actividades próximas de la comunidad.</p>
      </div>
      <button onClick={openNew} disabled={!privada} className="flex items-center gap-2 rounded-[14px] bg-[#0a496a] px-[26px] py-[16px] text-lg font-semibold text-white shadow disabled:opacity-50">
        <IoAdd size={22} /> Agregar Evento
      </button>
    </div>

    <div className="max-w-3xl">
      <SearchBar placeholder="Buscar eventos..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
    </div>

    {!privada && <p className="mb-4 mt-4 rounded bg-amber-100 p-3 text-amber-800">Únete a una privada antes de crear eventos.</p>}
    {error && <p className="mb-4 mt-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

    {loading ? (
      <p className="py-20 text-center text-xl text-[#0a496a]">Cargando eventos...</p>
    ) : (
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {items.map((item) => {
          const badge = eventBadge(item.status);
          const fecha = new Date(item.fecha_inicio);
          return (
            <article key={item.id} className="flex gap-6 rounded-[26px] bg-white p-6 shadow-[0_3px_10px_rgba(0,0,0,.18)]">
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="text-[22px] font-bold leading-snug text-slate-900">{item.titulo}</h2>
                <div className="mt-4 space-y-3 text-[15px] text-[#295c7f]">
                  <p className="m-0 flex items-center gap-2">
                    <IoCalendarOutline size={18} className="shrink-0" />
                    <span>
                      {fecha.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {" · "}
                      {fecha.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </p>
                  {item.ubicacion && (
                    <p className="m-0 flex items-center gap-2"><IoLocationOutline size={18} className="shrink-0" /><span className="truncate">{item.ubicacion}</span></p>
                  )}
                  {item.capacidad ? (
                    <p className="m-0 flex items-center gap-2"><IoPeopleOutline size={18} className="shrink-0" /><span>{item.capacidad} personas asistirán</span></p>
                  ) : (
                    <p className="m-0 flex items-center gap-2"><IoPeopleOutline size={18} className="shrink-0" /><span>Sin límite de asistentes</span></p>
                  )}
                </div>
                <button onClick={() => openEdit(item)} className="mt-auto w-fit rounded-xl bg-[#0a496a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#12486d]">
                  Gestionar Evento
                </button>
              </div>

              <div className="relative w-[42%] shrink-0 overflow-hidden rounded-xl">
                <span className={`absolute left-3 top-3 z-10 rounded-lg px-3 py-1 text-sm font-semibold shadow ${badge.bg} ${badge.text}`}>{badge.label}</span>
                {item.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imagen} alt={item.titulo} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-slate-100 text-slate-300"><IoImageOutline size={40} /></div>
                )}
              </div>
            </article>
          );
        })}
        {!items.length && <p className="col-span-full py-10 text-center text-slate-500">No hay eventos para mostrar.</p>}
      </div>
    )}

    {!loading && count > 20 && (
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    )}

    {modal && (
      <EventModal
        key={selectedEvent?.id ?? "create"}
        mode={modal}
        event={selectedEvent}
        privada={privada}
        saving={saving}
        onClose={close}
        onSubmit={(data) => void submit(data)}
        onDelete={modal === "edit" ? () => void remove(selectedEvent?.id) : undefined}
      />
    )}
  </main></div>;
}
