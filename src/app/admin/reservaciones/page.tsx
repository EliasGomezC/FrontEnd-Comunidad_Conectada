"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getAreas } from "@/services/areas";
import { createReservacion, deleteReservacion, getReservaciones, updateReservacion } from "@/services/reservaciones";
import type { Area } from "@/types/areas";
import type { Reservacion, ReservacionPayload } from "@/types/reservaciones";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import NewReservationModal from "./modal/NewReservationModal";
import ReservationDetailsModal from "./modal/ReservationDetailsModal";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

const estadoMap: Record<string, "Aprobado" | "Pendiente" | "Rechazado" | "Completado"> = { pendiente: "Pendiente", aprobada: "Aprobado", cancelada: "Rechazado" };

export default function ReservacionesPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Reservacion[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"new" | "details" | null>(null);
  const [reservation, setReservation] = useState<Reservacion | null>(null);
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

  const close = () => { setModal(null); setReservation(null); };
  const openNew = () => { setReservation(null); setModal("new"); };
  const openDetails = (item: Reservacion) => { setReservation(item); setModal("details"); };

  const submit = async (data: ReservacionPayload) => {
    if (!token) return;
    setSaving(true); setError(null);
    try {
      if (reservation) await updateReservacion(token, reservation.id, data);
      else await createReservacion(token, data);
      close(); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar la reservación."); }
    finally { setSaving(false); }
  };

  const cambiarEstado = async (estado: "aprobada" | "cancelada") => {
    if (!token || !reservation) return;
    setSaving(true); setError(null);
    try { await updateReservacion(token, reservation.id, { estado }); close(); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo actualizar la reservación."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => { if (!token || !window.confirm("¿Cancelar esta reservación?")) return; try { await deleteReservacion(token, id); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cancelar la reservación."); } };

  const filtered = items.filter((item) => `${item.folio} ${areas.find((a) => a.id === item.area)?.nombre || ""} ${item.descripcion || ""}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="flex min-h-screen bg-[#dfe5eb]"><Sidebar activeItem="Reservaciones" /><main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-24 lg:p-[30px] lg:pt-6">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-5"><div><h1 className="m-0 text-[52px] text-[#124b70]">Gestión de Reservaciones</h1><p className="m-0 text-[18px] text-[#295c7f]">Consulta y administra las reservaciones de la comunidad</p><SearchBar placeholder="Buscar reservación" className="mt-3 w-[560px] max-w-full" value={search} onChange={(e) => setSearch(e.target.value)} /></div><button onClick={openNew} disabled={!areas.length} className="rounded-[14px] bg-[#0a496a] p-4 text-lg text-white disabled:opacity-50">＋ Nueva Reservación</button></div>
    {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
    {loading ? <p className="py-20 text-center text-xl text-[#0a496a]">Cargando reservaciones...</p> : <div className="overflow-x-auto rounded-[0_0_30px_30px] border-2 border-[#2b6a8b] bg-white shadow"><table className="w-full border-collapse"><thead><tr className="bg-[#0a496a] text-left text-white"><th className="p-4">Folio</th><th className="p-4">Área</th><th className="p-4">Fecha</th><th className="p-4">Horario</th><th className="p-4">Estado</th><th className="p-4">Acciones</th></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.id} className={index % 2 ? "bg-white" : "bg-[#eef2f6]"}><td className="p-4">#{item.folio}</td><td className="p-4">{areas.find((area) => area.id === item.area)?.nombre || `Área ${item.area}`}</td><td className="p-4">{item.fecha}</td><td className="p-4">{item.hora_inicio.slice(0, 5)} – {item.hora_fin.slice(0, 5)}</td><td className="p-4"><StatusBadge status={estadoMap[item.estado] || "Pendiente"} /></td><td className="flex gap-2 p-4"><button onClick={() => openDetails(item)} title="Ver detalle"><IoPencilOutline size={20} /></button><button onClick={() => void remove(item.id)} title="Cancelar" className="text-red-700"><IoTrashOutline size={20} /></button></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="p-8 text-center">No hay reservaciones.</td></tr>}</tbody></table></div>}

    {modal === "new" && (
      <NewReservationModal
        key={reservation?.id ?? "create"}
        open
        areas={areas}
        reservations={items}
        initial={reservation}
        saving={saving}
        onClose={close}
        onSubmit={(data) => void submit(data)}
      />
    )}

    {modal === "details" && reservation && (
      <ReservationDetailsModal
        key={reservation.id}
        open
        reservation={reservation}
        areas={areas}
        solicitante={reservation.usuario === user?.id ? (user?.perfil?.nombres || "Tú") : "Habitante"}
        saving={saving}
        onClose={close}
        onSolicitarCambios={() => setModal("new")}
        onRechazar={() => void cambiarEstado("cancelada")}
        onAprobar={() => void cambiarEstado("aprobada")}
      />
    )}
  </main></div>;
}
