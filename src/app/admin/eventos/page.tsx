"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { createEvento, deleteEvento, getEventos, updateEvento } from "@/services/eventos";
import type { Evento, EventoPayload } from "@/types/eventos";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import EventModal from "@/components/EventModal";
import { IoCalendarOutline, IoLocationOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

export default function EventosPage() {
  const { token, user } = useAuth();
  const privada = user?.membresias?.[0]?.privada || "";
  const [items, setItems] = useState<Evento[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { if (!token) return; try { setLoading(true); const data = await getEventos(token); setItems(data.results); setError(null); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron cargar los eventos."); } finally { setLoading(false); } }, [token]);
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

  const remove = async (id: string) => { if (!token || !window.confirm("¿Eliminar este evento?")) return; try { await deleteEvento(token, id); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo eliminar el evento."); } };

  const filtered = items.filter((item) => `${item.titulo} ${item.descripcion || ""} ${item.ubicacion || ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="flex min-h-screen bg-[#dfe5eb]"><Sidebar activeItem="Eventos"/><main className="flex-1 p-[30px]"><div className="mb-8 flex flex-wrap items-start justify-between gap-5"><div><h1 className="m-0 text-[52px] text-[#124b70]">Eventos</h1><p className="m-0 text-[22px] text-[#124b70]">Gestiona las actividades próximas de la comunidad.</p><SearchBar placeholder="Buscar eventos..." className="mt-3 w-[600px] max-w-full" value={search} onChange={(e)=>setSearch(e.target.value)}/></div><button onClick={openNew} disabled={!privada} className="rounded-[14px] bg-[#0a496a] px-[26px] py-[18px] text-lg text-white disabled:opacity-50">＋ Agregar evento</button></div>{!privada&&<p className="mb-4 rounded bg-amber-100 p-3 text-amber-800">Únete a una privada antes de crear eventos.</p>}{error&&<p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}{loading?<p className="py-20 text-center text-xl text-[#0a496a]">Cargando eventos...</p>:<div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-7">{filtered.map((item)=><article key={item.id} className="rounded-[22px] bg-white p-5 shadow"><h2 className="text-xl font-bold text-slate-900">{item.titulo}</h2><p className="flex items-center gap-2"><IoCalendarOutline/>{new Date(item.fecha_inicio).toLocaleString("es-MX")}</p>{item.ubicacion&&<p className="flex items-center gap-2"><IoLocationOutline/>{item.ubicacion}</p>}<p className="text-slate-700">{item.descripcion||"Sin descripción"}</p><div className="mt-4 flex justify-end gap-3"><button onClick={()=>openEdit(item)} className="flex items-center gap-1 rounded bg-[#ffd58d] px-3 py-2"><IoPencilOutline/>Editar</button><button onClick={()=>void remove(item.id)} className="flex items-center gap-1 rounded bg-[#ffb9b9] px-3 py-2"><IoTrashOutline/>Eliminar</button></div></article>)}{!filtered.length&&<p>No hay eventos para mostrar.</p>}</div>}

    {modal && (
      <EventModal
        key={selectedEvent?.id ?? "create"}
        mode={modal}
        event={selectedEvent}
        privada={privada}
        saving={saving}
        onClose={close}
        onSubmit={(data) => void submit(data)}
      />
    )}
  </main></div>;
}
