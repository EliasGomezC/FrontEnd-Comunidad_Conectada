"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { IoCalendar, IoImageOutline, IoPeople } from "react-icons/io5";
import HabitantePage, { EmptyState, ModuleHeader } from "@/components/HabitantePage";
import GalleryDisplay from "@/components/ui/GalleryDisplay";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/features/authentication/AuthContext";
import { getProyectos } from "@/services/proyectos";
import type { Proyecto } from "@/types/proyectos";

export default function EventosProyectosHabitante() {
  const { token, activeMembership } = useAuth();
  const [items, setItems] = useState<Proyecto[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !activeMembership) return;
    const run = async () => {
      setLoading(true);
      try {
        const data = await getProyectos(token, { privada: activeMembership.privada, search: search || undefined, page });
        setItems(data.results);
        setCount(data.count);
        setError("");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "No se pudieron cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token, activeMembership, search, page]);

  return (
    <HabitantePage activeItem="Eventos y proyectos">
      <ModuleHeader
        title="Eventos y proyectos"
        subtitle="Actividades y mejoras planeadas para tu comunidad."
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <EmptyState loading={loading} error={error} empty={!items.length} />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((project) => (
          <article key={project.id} className="overflow-hidden rounded-2xl bg-white shadow">
            <div className="relative h-52 w-full bg-slate-100">
              {project.imagen ? (
                <img src={project.imagen} alt={project.nombre} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-slate-300">
                  <IoImageOutline size={42} />
                </div>
              )}
              {project.galeria && project.galeria.length > 0 && (
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white">
                  {project.galeria.length + 1} fotos
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between gap-3">
                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold">{project.tipo || "Proyecto"}</span>
                <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold capitalize">{project.estado.replace("_", " ")}</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#0a496a]">{project.nombre}</h2>
              <p className="my-4 text-gray-600">{project.descripcion}</p>
              <div className="flex flex-wrap gap-5 text-sm text-[#295c7f]">
                <span className="flex items-center gap-2"><IoCalendar />{project.fecha_inicio ? new Date(`${project.fecha_inicio}T12:00`).toLocaleDateString("es-MX") : "Fecha por definir"}</span>
                <span className="flex items-center gap-2"><IoPeople />Capacidad: {project.capacidad}</span>
              </div>
              {project.galeria && project.galeria.length > 0 && <div className="mt-4"><GalleryDisplay images={project.galeria} size={72} /></div>}
            </div>
          </article>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(count / 20))} onPageChange={setPage} />
    </HabitantePage>
  );
}
