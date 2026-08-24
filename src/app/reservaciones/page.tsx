"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { IoAdd, IoCalendarOutline, IoClose, IoImageOutline, IoInformationCircleOutline } from "react-icons/io5";
import HabitantePage, { EmptyState, ModuleHeader } from "@/components/HabitantePage";
import GalleryDisplay from "@/components/ui/GalleryDisplay";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/features/authentication/AuthContext";
import { getAreas } from "@/services/areas";
import { crearReservacion, getReservaciones } from "@/services/reservaciones";
import type { Area } from "@/types/areas";
import type { Reservacion } from "@/types/reservaciones";

type Availability = "unchecked" | "available" | "unavailable" | "incomplete";

const availabilityLabel: Record<Availability, { text: string; classes: string }> = {
  unchecked: { text: "Sin verificar", classes: "bg-slate-100 text-slate-600" },
  available: { text: "Disponible", classes: "bg-green-100 text-green-700" },
  unavailable: { text: "No disponible", classes: "bg-red-100 text-red-700" },
  incomplete: { text: "Completa el horario", classes: "bg-amber-100 text-amber-700" },
};

export default function ReservacionesHabitante() {
  const { token, activeMembership } = useAuth();
  const [items, setItems] = useState<Reservacion[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState<Availability>("unchecked");
  const [form, setForm] = useState({
    area: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    num_asistentes: 1,
    descripcion: "",
  });

  async function load() {
    if (!token || !activeMembership) return;
    setLoading(true);
    try {
      const [reservations, areaData] = await Promise.all([
        getReservaciones(token, { privada: activeMembership.privada, search: search || undefined, page }),
        getAreas(token, { privada: activeMembership.privada }),
      ]);
      setItems(reservations.results);
      setCount(reservations.count);
      setAreas(areaData.results);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar las reservaciones.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const run = async () => {
      await load();
    };
    void run();
  }, [token, activeMembership, search, page]);

  const selectedArea = useMemo(() => areas.find((area) => area.id === form.area) || null, [areas, form.area]);

  const verifyAvailability = () => {
    if (!form.area || !form.fecha || !form.hora_inicio || !form.hora_fin) {
      setAvailability("incomplete");
      return;
    }
    const overlap = items.some((reservation) =>
      reservation.area === form.area &&
      reservation.fecha === form.fecha &&
      (reservation.estado === "pendiente" || reservation.estado === "aprobada") &&
      reservation.hora_inicio.slice(0, 5) < form.hora_fin &&
      reservation.hora_fin.slice(0, 5) > form.hora_inicio
    );
    setAvailability(overlap ? "unavailable" : "available");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    verifyAvailability();
    try {
      await crearReservacion(token, form);
      setOpen(false);
      setAvailability("unchecked");
      setForm({ area: "", fecha: "", hora_inicio: "", hora_fin: "", num_asistentes: 1, descripcion: "" });
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo reservar.");
    }
  };

  return (
    <HabitantePage activeItem="Reservaciones">
      <ModuleHeader
        title="Mis reservaciones"
        subtitle="Reserva y consulta las áreas comunes de tu privada."
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        action={
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#0a496a] px-6 py-4 font-bold text-white">
            <IoAdd />
            Nueva reservación
          </button>
        }
      />
      <EmptyState loading={loading} error={error} empty={!items.length} />
      {!loading && !error && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead className="bg-[#0a496a] text-white">
                <tr>{["Área", "Fecha", "Horario", "Asistentes", "Estado"].map((heading) => <th key={heading} className="p-4 text-left">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {items.map((reservation) => (
                  <tr key={reservation.id} className="border-b even:bg-slate-50">
                    <td className="p-4 font-semibold">{reservation.area_nombre}</td>
                    <td>{new Date(`${reservation.fecha}T12:00`).toLocaleDateString("es-MX")}</td>
                    <td>{reservation.hora_inicio.slice(0, 5)} - {reservation.hora_fin.slice(0, 5)}</td>
                    <td>{reservation.num_asistentes}</td>
                    <td><span className="rounded-lg bg-orange-100 px-3 py-2 capitalize">{reservation.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(count / 20))} onPageChange={setPage} />
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <form onSubmit={submit} className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0a496a]">Nueva reservación</h2>
                <p className="text-slate-500">Valida disponibilidad antes de enviar la solicitud.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}><IoClose size={28} /></button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-4">
                <select required value={form.area} onChange={(event) => { setForm({ ...form, area: event.target.value }); setAvailability("unchecked"); }} className="rounded-xl border p-3">
                  <option value="">Selecciona un área</option>
                  {areas.map((area) => <option key={area.id} value={area.id}>{area.nombre} (capacidad {area.capacidad})</option>)}
                </select>
                <input required type="date" value={form.fecha} onChange={(event) => { setForm({ ...form, fecha: event.target.value }); setAvailability("unchecked"); }} className="rounded-xl border p-3" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required type="time" value={form.hora_inicio} onChange={(event) => { setForm({ ...form, hora_inicio: event.target.value }); setAvailability("unchecked"); }} className="rounded-xl border p-3" />
                  <input required type="time" value={form.hora_fin} onChange={(event) => { setForm({ ...form, hora_fin: event.target.value }); setAvailability("unchecked"); }} className="rounded-xl border p-3" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required min={1} type="number" value={form.num_asistentes} onChange={(event) => setForm({ ...form, num_asistentes: Number(event.target.value) })} className="rounded-xl border p-3" placeholder="Número de asistentes" />
                  <div className={`flex items-center justify-between rounded-xl px-4 py-3 font-semibold ${availabilityLabel[availability].classes}`}>
                    <span>Disponibilidad</span>
                    <span>{availabilityLabel[availability].text}</span>
                  </div>
                </div>
                <textarea value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} className="min-h-28 rounded-xl border p-3" placeholder="Descripción o notas" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={verifyAvailability} className="rounded-xl border border-[#0a496a] p-4 font-bold text-[#0a496a]">
                    Verificar disponibilidad
                  </button>
                  <button className="rounded-xl bg-[#0a496a] p-4 font-bold text-white">Solicitar reservación</button>
                </div>
              </div>
              <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#0a496a]">
                  <IoCalendarOutline />
                  Área seleccionada
                </h3>
                {selectedArea ? (
                  <div className="mt-4 space-y-4">
                    {selectedArea.imagen ? (
                      <img src={selectedArea.imagen} alt={selectedArea.nombre} className="h-44 w-full rounded-2xl object-cover" />
                    ) : (
                      <div className="grid h-44 place-items-center rounded-2xl bg-white text-slate-300">
                        <IoImageOutline size={40} />
                      </div>
                    )}
                    <div>
                      <p className="text-xl font-bold text-slate-900">{selectedArea.nombre}</p>
                      <p className="mt-2 text-sm text-slate-600">{selectedArea.descripcion || "Sin descripción disponible."}</p>
                      <p className="mt-3 text-sm font-semibold text-[#295c7f]">Capacidad máxima: {selectedArea.capacidad}</p>
                    </div>
                    <GalleryDisplay images={selectedArea.galeria} size={72} />
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                    Selecciona un área para ver su información e imágenes.
                  </div>
                )}
                <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900">
                  <p className="flex items-start gap-2">
                    <IoInformationCircleOutline className="mt-0.5 shrink-0" />
                    El estado de disponibilidad se muestra dentro de este modal y se recalcula con tus datos actuales.
                  </p>
                </div>
              </aside>
            </div>
          </form>
        </div>
      )}
    </HabitantePage>
  );
}
