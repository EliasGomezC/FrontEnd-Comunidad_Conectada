"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { createContacto, deleteContacto, getDirectorio, updateContacto } from "@/services/directorio";
import type { DirectorioContacto, DirectorioPayload } from "@/types/directorio";
import type { GalleryStoredImage } from "@/components/ui/GalleryInput";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import BaseModal from "@/components/Modal/BaseModal";
import ContactForm from "@/components/Modal/ContactForm";
import ContactDetails from "@/components/Modal/ContactDetails";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmation";
import { IoCallOutline, IoFilter, IoImageOutline } from "react-icons/io5";

const empty = (privada = ""): DirectorioPayload => ({
  privada,
  nombre: "",
  categorias: "",
  num_tel: "",
  codigo: "",
  descripcion: "",
  ubicacion: "",
  tipo_ubicacion: "local",
  numero_casa: "",
  direccion_externa: "",
  maps_url: "",
});

type ModalType = "create" | "view" | "edit" | "delete";

export default function DirectorioPage() {
  const { token, user } = useAuth();
  const privada = user?.membresias?.[0]?.privada || "";
  const [items, setItems] = useState<DirectorioContacto[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [selectedContact, setSelectedContact] = useState<DirectorioContacto | null>(null);
  const [form, setForm] = useState<DirectorioPayload>(empty());
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryStoredImage[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryRemoved, setGalleryRemoved] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const mainObjectUrl = useRef<string | null>(null);

  const revokeMainPreview = () => { if (mainObjectUrl.current) { URL.revokeObjectURL(mainObjectUrl.current); mainObjectUrl.current = null; } };

  const load = useCallback(async () => { if (!token) return; try { setLoading(true); const data = await getDirectorio(token); setItems(data.results); setError(null); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar el directorio."); } finally { setLoading(false); } }, [token]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la carga asíncrona actualiza el estado al resolver la API.
    void load();
  }, [load]);

  const close = () => { revokeMainPreview(); setModalType(null); setSelectedContact(null); setForm(empty()); setMainPreview(null); setGalleryImages([]); setGalleryFiles([]); setGalleryRemoved([]); setModalError(null); };
  const openCreate = () => { setForm(empty(privada)); setSelectedContact(null); setMainPreview(null); setGalleryImages([]); setGalleryFiles([]); setGalleryRemoved([]); setModalError(null); setModalType("create"); };
  const openView = (item: DirectorioContacto) => { setSelectedContact(item); setModalError(null); setModalType("view"); };
  const openEdit = (item: DirectorioContacto) => {
    setModalError(null);
    setSelectedContact(item);
    setForm({
      privada: item.privada,
      nombre: item.nombre,
      categorias: item.categorias,
      num_tel: item.num_tel,
      codigo: item.codigo,
      descripcion: item.descripcion || "",
      ubicacion: item.ubicacion || "",
      tipo_ubicacion: item.tipo_ubicacion || "local",
      numero_casa: item.numero_casa || "",
      direccion_externa: item.direccion_externa || "",
      maps_url: item.maps_url || "",
    });
    setMainPreview(item.imagenes || null);
    setGalleryImages(item.galeria || []);
    setGalleryFiles([]);
    setGalleryRemoved([]);
    setModalType("edit");
  };
  const openDelete = (item: DirectorioContacto) => { setSelectedContact(item); setModalError(null); setModalType("delete"); };

  const submit = async () => {
    if (!token || !modalType) return;
    setSaving(true); setModalError(null);
    try {
      const data: DirectorioPayload = {
        ...form,
        privada: form.privada || privada,
        galeria_archivos: galleryFiles.length ? galleryFiles : undefined,
        galeria_eliminar: galleryRemoved.length ? galleryRemoved : undefined,
      };
      if (modalType === "edit" && selectedContact) await updateContacto(token, selectedContact.id, data);
      else await createContacto(token, data);
      close(); await load();
    } catch (cause) { setModalError(cause instanceof Error ? cause.message : "No se pudo guardar el contacto."); }
    finally { setSaving(false); }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  const confirmDelete = async () => {
    if (!token || !selectedContact) return;
    setSaving(true); setModalError(null);
    try { await deleteContacto(token, selectedContact.id); close(); await load(); }
    catch (cause) { setModalError(cause instanceof Error ? cause.message : "No se pudo eliminar el contacto."); }
    finally { setSaving(false); }
  };

  const updateForm = (patch: Partial<DirectorioPayload>) => setForm((current) => ({ ...current, ...patch }));

  const handleMainImage = (file: File | null) => {
    revokeMainPreview();
    updateForm({ imagenes: file });
    if (file) {
      mainObjectUrl.current = URL.createObjectURL(file);
      setMainPreview(mainObjectUrl.current);
    } else {
      setMainPreview(selectedContact?.imagenes || null);
    }
  };

  const handleGalleryChange = (files: File[], removedIds: string[]) => {
    setGalleryFiles(files);
    setGalleryRemoved(removedIds);
  };

  const categories = Array.from(new Set(items.map((item) => item.categorias).filter(Boolean)));
  const filtered = items.filter((item) =>
    `${item.nombre} ${item.categorias} ${item.descripcion || ""}`.toLowerCase().includes(search.toLowerCase()) &&
    (!category || item.categorias === category)
  );
  const modalTitle = modalType === "create" ? "Nuevo Contacto" : modalType === "edit" ? "Editar Contacto" : modalType === "view" ? selectedContact?.nombre || "Ver Contacto" : undefined;

  return <div className="flex min-h-screen bg-[#eef2f7]"><Sidebar activeItem="Directorio" /><main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-24 md:p-[30px] md:pt-6">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
      <div>
        <h1 className="m-0 text-5xl font-bold text-[#0a496a]">Directorio Virtual</h1>
      </div>
      <button onClick={openCreate} disabled={!privada} className="h-14 rounded-xl bg-[#0a496a] px-8 text-xl font-semibold text-white disabled:opacity-50">
        + Añadir Contacto
      </button>
    </div>

    <div className="mb-8 flex gap-3">
      <SearchBar placeholder="Buscar contacto..." className="w-[520px] max-w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="relative">
        <button onClick={() => setFilterOpen((v) => !v)} aria-label="Filtrar por categoría" className={`grid h-14 w-16 place-items-center rounded-xl bg-[#c8e7fc] transition hover:bg-[#b4dcf5] ${category ? "ring-2 ring-[#0a496a]" : ""}`}>
          <IoFilter size={22} className="text-[#0a496a]" />
        </button>
        {filterOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl bg-white py-2 shadow-xl">
              <button onClick={() => { setCategory(""); setFilterOpen(false); }} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Todas las categorías</button>
              {categories.map((c) => (
                <button key={c} onClick={() => { setCategory(c); setFilterOpen(false); }} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">{c}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>

    {!privada && <p className="mb-4 rounded bg-amber-100 p-3 text-amber-800">Únete a una privada antes de añadir contactos.</p>}
    {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

    {loading ? (
      <p className="py-20 text-center text-xl text-[#0a496a]">Cargando directorio...</p>
    ) : (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} onClick={() => openView(item)} className="group cursor-pointer rounded-[26px] bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-full">
              <div className="flex min-w-0 flex-1 flex-col p-6">
                <h2 className="truncate text-xl font-bold text-slate-900">{item.nombre}</h2>
                <span className="mt-3 inline-block w-fit rounded-lg bg-[#bfe6b5] px-3 py-1 text-sm font-medium text-[#215d2d]">{item.categorias || "Sin categoría"}</span>
                <p className="mt-3 flex items-center gap-2 text-slate-700"><IoCallOutline className="text-[#0a496a]" /> {item.num_tel || "Sin teléfono"}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.descripcion || item.ubicacion || "Sin descripción"}</p>
                <div className="mt-5 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); openView(item); }} className="rounded-lg bg-[#0a496a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12486d]">Mostrar</button>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="rounded-lg bg-[#ffd58d] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95">Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); openDelete(item); }} className="rounded-lg bg-[#ffb8b8] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95">Eliminar</button>
                </div>
              </div>
              <div className="flex w-[180px] shrink-0 items-stretch p-3 pl-0">
                <div className="h-[170px] w-full overflow-hidden rounded-2xl">
                  {item.imagenes ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imagenes} alt={item.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-slate-100 text-slate-300"><IoImageOutline size={32} /></div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
        {!filtered.length && <p className="col-span-full py-10 text-center text-slate-500">No hay contactos para mostrar.</p>}
      </div>
    )}

    <BaseModal
      open={modalType !== null}
      title={modalTitle}
      onClose={close}
      footer={(modalType === "create" || modalType === "edit") ? (
        <>
          <Button variant="secondary" type="button" onClick={close} style={{ flex: 1 }}>Cancelar</Button>
          <Button variant="primary" type="submit" form="contact-form" loading={saving} style={{ flex: 1 }}>Guardar</Button>
        </>
      ) : modalType === "view" ? (
        <>
          <Button variant="secondary" type="button" onClick={close} style={{ flex: 1 }}>Regresar</Button>
          <Button variant="primary" type="button" onClick={(event) => { event.preventDefault(); if (selectedContact) openEdit(selectedContact); }} style={{ flex: 1 }}>Editar</Button>
        </>
      ) : undefined}
    >
      {modalError && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{modalError}</p>}
      {(modalType === "create" || modalType === "edit") && (
        <form id="contact-form" onSubmit={handleSubmit}>
          <ContactForm
            form={form}
            onChange={updateForm}
            mainImage={mainPreview}
            onMainImageChange={handleMainImage}
            gallery={galleryImages}
            onGalleryChange={handleGalleryChange}
          />
        </form>
      )}
      {modalType === "view" && selectedContact && <ContactDetails contact={selectedContact} />}
      {modalType === "delete" && selectedContact && (
        <DeleteConfirmation contact={selectedContact} onCancel={close} onConfirm={() => void confirmDelete()} saving={saving} />
      )}
    </BaseModal>
  </main></div>;
}
