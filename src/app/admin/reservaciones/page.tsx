"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getAreas } from "@/services/areas";
import { createReservacion, deleteReservacion, getReservaciones, updateReservacion } from "@/services/reservaciones";
import type { Area } from "@/types/areas";
import type { Reservacion, ReservacionPayload } from "@/types/reservaciones";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

const estadoMap: Record<string, "Aprobado" | "Pendiente" | "Rechazado" | "Completado"> = { pendiente: "Pendiente", aprobada: "Aprobado", cancelada: "Rechazado" };
const blankForm = (): ReservacionPayload => ({ area: 0, fecha: "", hora_inicio: "", hora_fin: "", num_asistentes: 1, descripcion: "" });

export default function ReservacionesPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Reservacion[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Reservacion | null>(null);
  const [form, setForm] = useState<ReservacionPayload>(blankForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [reservaciones, areasResponse] = await Promise.all([getReservaciones(token), getAreas(token)]);
      setItems(reservaciones.results); setAreas(areasResponse.results); setError(null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron cargar las reservaciones."); }
    finally { setLoading(false); }
  }, [token]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la carga asíncrona actualiza el estado al resolver la API.
    void load();
  }, [load]);

  const openNew = () => { setEditing(null); setForm({ ...blankForm(), area: areas[0]?.id || 0 }); };
  const openEdit = (item: Reservacion) => { setEditing(item); setForm({ area: item.area, fecha: item.fecha, hora_inicio: item.hora_inicio.slice(0, 5), hora_fin: item.hora_fin.slice(0, 5), num_asistentes: item.num_asistentes, descripcion: item.descripcion || "", estado: item.estado }); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!token) return;
    try { setSaving(true); if (editing) await updateReservacion(token, editing.id, form); else await createReservacion(token, form); setEditing(null); setForm(blankForm()); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar la reservación."); }
    finally { setSaving(false); }
  };
  const remove = async (id: number) => { if (!token || !window.confirm("¿Cancelar esta reservación?")) return; try { await deleteReservacion(token, id); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cancelar la reservación."); } };
  const filtered = items.filter((item) => `${item.folio} ${areas.find((a) => a.id === item.area)?.nombre || ""} ${item.descripcion || ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="flex min-h-screen bg-[#dfe5eb]"><Sidebar activeItem="Reservaciones" /><main className="flex-1 p-[30px]">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-5"><div><h1 className="m-0 text-[52px] text-[#124b70]">Gestión de Reservaciones</h1><p className="m-0 text-[18px] text-[#295c7f]">Consulta y administra las reservaciones de la comunidad</p><SearchBar placeholder="Buscar reservación" className="mt-3 w-[560px] max-w-full" value={search} onChange={(e) => setSearch(e.target.value)} /></div><button onClick={openNew} disabled={!areas.length} className="rounded-[14px] bg-[#0a496a] p-4 text-lg text-white disabled:opacity-50">＋ Nueva Reservación</button></div>
    {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
    {loading ? <p className="py-20 text-center text-xl text-[#0a496a]">Cargando reservaciones...</p> : <div className="overflow-x-auto rounded-[0_0_30px_30px] border-2 border-[#2b6a8b] bg-white shadow"><table className="w-full border-collapse"><thead><tr className="bg-[#0a496a] text-left text-white"><th className="p-4">Folio</th><th className="p-4">Área</th><th className="p-4">Fecha</th><th className="p-4">Horario</th><th className="p-4">Estado</th><th className="p-4">Acciones</th></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.id} className={index % 2 ? "bg-white" : "bg-[#eef2f6]"}><td className="p-4">#{item.folio}</td><td className="p-4">{areas.find((area) => area.id === item.area)?.nombre || `Área ${item.area}`}</td><td className="p-4">{item.fecha}</td><td className="p-4">{item.hora_inicio.slice(0, 5)} – {item.hora_fin.slice(0, 5)}</td><td className="p-4"><StatusBadge status={estadoMap[item.estado] || "Pendiente"} /></td><td className="flex gap-2 p-4"><button onClick={() => openEdit(item)} title="Editar"><IoPencilOutline size={20} /></button><button onClick={() => void remove(item.id)} title="Cancelar" className="text-red-700"><IoTrashOutline size={20} /></button></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="p-8 text-center">No hay reservaciones.</td></tr>}</tbody></table></div>}
    {(editing || form.area > 0) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={submit} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6"><h2 className="text-2xl font-bold">{editing ? "Editar reservación" : "Nueva reservación"}</h2><select required value={form.area} onChange={(e) => setForm({ ...form, area: Number(e.target.value) })} className="w-full rounded border p-3"><option value={0}>Selecciona un área</option>{areas.map((area) => <option key={area.id} value={area.id}>{area.nombre}</option>)}</select><div className="grid gap-4 sm:grid-cols-2"><input required type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="rounded border p-3"/><input required min="1" type="number" value={form.num_asistentes} onChange={(e) => setForm({ ...form, num_asistentes: Number(e.target.value) })} className="rounded border p-3"/></div><div className="grid gap-4 sm:grid-cols-2"><input required type="time" value={form.hora_inicio} onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} className="rounded border p-3"/><input required type="time" value={form.hora_fin} onChange={(e) => setForm({ ...form, hora_fin: e.target.value })} className="rounded border p-3"/></div>{editing && <select value={form.estado || "pendiente"} onChange={(e) => setForm({ ...form, estado: e.target.value as Reservacion["estado"] })} className="w-full rounded border p-3"><option value="pendiente">Pendiente</option><option value="aprobada">Aprobada</option><option value="cancelada">Cancelada</option></select>}<textarea placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="w-full rounded border p-3"/><div className="flex justify-end gap-3"><button type="button" onClick={() => { setEditing(null); setForm(blankForm()); }} className="rounded px-4 py-2">Cancelar</button><button disabled={saving || !user} className="rounded bg-[#0a496a] px-4 py-2 text-white">{saving ? "Guardando..." : "Guardar"}</button></div></form></div>}
  </main></div>;
}
