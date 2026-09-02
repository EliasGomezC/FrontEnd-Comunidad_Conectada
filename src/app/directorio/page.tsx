"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { IoCall, IoImageOutline, IoLocation } from "react-icons/io5";
import HabitantePage, { EmptyState, ModuleHeader } from "@/components/HabitantePage";
import Pagination from "@/components/Pagination";
import BaseModal from "@/components/Modal/BaseModal";
import ContactDetails from "@/components/Modal/ContactDetails";
import { useAuth } from "@/features/authentication/AuthContext";
import { getDirectorio } from "@/services/directorio";
import type { DirectorioContacto } from "@/types/directorio";

export default function DirectorioHabitante() {
  const { token, activeMembership } = useAuth();
  const [items, setItems] = useState<DirectorioContacto[]>([]);
  const [selected, setSelected] = useState<DirectorioContacto | null>(null);
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
        const data = await getDirectorio(token, { privada: activeMembership.privada, search: search || undefined, page });
        setItems(data.results);
        setCount(data.count);
        setError("");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "No se pudo cargar el directorio.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token, activeMembership, search, page]);

  return (
    <HabitantePage activeItem="Directorio">
      <ModuleHeader
        title="Directorio virtual"
        subtitle="Contactos y servicios disponibles en tu privada."
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <EmptyState loading={loading} error={error} empty={!items.length} />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((contact) => (
          <button
            type="button"
            key={contact.id}
            onClick={() => setSelected(contact)}
            className="overflow-hidden rounded-2xl bg-white text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-44 w-full bg-slate-100">
              {contact.imagenes ? (
                <img src={contact.imagenes} alt={contact.nombre} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-slate-300">
                  <IoImageOutline size={40} />
                </div>
              )}
              {contact.galeria && contact.galeria.length > 0 && (
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-white">
                  {contact.galeria.length + 1} fotos
                </span>
              )}
            </div>
            <div className="p-6">
              <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-[#0a496a]">
                {contact.categorias}
              </span>
              <h2 className="mt-4 text-xl font-bold text-[#0a496a]">{contact.nombre}</h2>
              <p className="my-3 min-h-12 text-gray-600">{contact.descripcion || "Sin descripción"}</p>
              {contact.ubicacion && (
                <p className="flex items-center gap-2 text-sm">
                  <IoLocation />
                  {contact.ubicacion}
                </p>
              )}
              {contact.num_tel ? (
                <a
                  href={`tel:${contact.num_tel}`}
                  onClick={(event) => event.stopPropagation()}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0a496a] p-3 font-bold text-white"
                >
                  <IoCall />
                  Llamar {contact.num_tel}
                </a>
              ) : (
                <p className="mt-4 text-sm text-gray-400">Sin teléfono disponible</p>
              )}
            </div>
          </button>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(count / 20))} onPageChange={setPage} />
      <BaseModal
        open={Boolean(selected)}
        title={selected?.nombre}
        onClose={() => setSelected(null)}
        footer={null}
      >
        {selected && <ContactDetails contact={selected} />}
      </BaseModal>
    </HabitantePage>
  );
}
