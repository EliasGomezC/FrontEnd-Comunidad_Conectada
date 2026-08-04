"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { createContacto, deleteContacto, getDirectorio, updateContacto } from "@/services/directorio";
import type { DirectorioContacto, DirectorioPayload } from "@/types/directorio";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import BaseModal from "@/components/Modal/BaseModal";
import ContactForm from "@/components/Modal/ContactForm";
import ContactDetails from "@/components/Modal/ContactDetails";
import DeleteConfirmation from "@/components/Modal/DeleteConfirmation";
import { IoCallOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

const empty = (privada = ""): DirectorioPayload => ({ privada, nombre: "", categorias: "", num_tel: "", codigo: "", descripcion: "", ubicacion: "" });

type ModalType = "create" | "view" | "edit" | "delete";

export default function DirectorioPage() {
  const { token, user } = useAuth();
  const privada = user?.membresias?.[0]?.privada || "";
  const [items, setItems] = useState<DirectorioContacto[]>([]); const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [selectedContact, setSelectedContact] = useState<DirectorioContacto | null>(null);
  const [form, setForm] = useState<DirectorioPayload>(empty());
  const [preview, setPreview] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const previewUrls = useRef<string[]>([]);

  const revokePreviews = () => { previewUrls.current.forEach((url) => URL.revokeObjectURL(url)); previewUrls.current = []; };

  const load = useCallback(async () => { if (!token) return; try { setLoading(true); const data = await getDirectorio(token); setItems(data.results); setError(null); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar el directorio."); } finally { setLoading(false); } }, [token]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- la carga asíncrona actualiza el estado al resolver la API.
    void load();
  }, [load]);

  const close = () => { revokePreviews(); setModalType(null); setSelectedContact(null); setForm(empty()); setPreview([]); };
  const openCreate = () => { setForm(empty(privada)); setSelectedContact(null); setPreview([]); setModalType("create"); };
  const openView = (item: DirectorioContacto) => { setSelectedContact(item); setModalType("view"); };
  const openEdit = (item: DirectorioContacto) => { setSelectedContact(item); setForm({ privada: item.privada, nombre: item.nombre, categorias: item.categorias, num_tel: item.num_tel, codigo: item.codigo, descripcion: item.descripcion || "", ubicacion: item.ubicacion || "" }); setPreview(item.imagenes ? [item.imagenes] : []); setModalType("edit"); };
  const openDelete = (item: DirectorioContacto) => { setSelectedContact(item); setModalType("delete"); };

  const submit = async () => {
    if (!token || !modalType) return;
    setSaving(true); setError(null);
    try {
      const data: DirectorioPayload = { ...form, privada: form.privada || privada };
      if (modalType === "edit" && selectedContact) await updateContacto(token, selectedContact.id, data);
      else await createContacto(token, data);
      close(); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar el contacto."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!token || !selectedContact) return;
    setSaving(true); setError(null);
    try { await deleteContacto(token, selectedContact.id); close(); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo eliminar el contacto."); }
    finally { setSaving(false); }
  };

  const updateForm = (patch: Partial<DirectorioPayload>) => setForm((current) => ({ ...current, ...patch }));
  const onAddImages = (files: File[]) => {
    if (!files.length) return;
    revokePreviews();
    updateForm({ imagenes: files[0] });
    previewUrls.current = [URL.createObjectURL(files[0])];
    setPreview(previewUrls.current);
  };
  const onRemoveImage = () => { revokePreviews(); updateForm({ imagenes: null }); setPreview([]); };

  const filtered = items.filter((item) => `${item.nombre} ${item.categorias} ${item.descripcion || ""}`.toLowerCase().includes(search.toLowerCase()));
  const modalTitle = modalType === "create" ? "Nuevo Contacto" : modalType === "edit" ? "Editar Contacto" : modalType === "view" ? selectedContact?.nombre || "Ver Contacto" : undefined;

  return <div className="flex min-h-screen bg-[#dde3ea]"><Sidebar activeItem="Directorio"/><main className="flex-1 p-[30px]"><div className="mb-8 flex flex-wrap items-center justify-between gap-5"><div><h1 className="m-0 mb-5 text-[52px] text-[#12486d]">Directorio Virtual</h1><SearchBar placeholder="Buscar contacto..." className="w-[500px] max-w-full" value={search} onChange={(e) => setSearch(e.target.value)}/></div><button onClick={openCreate} disabled={!privada} className="rounded-[14px] bg-[#0a496a] px-[26px] py-[18px] text-white disabled:opacity-50">+ Añadir contacto</button></div>{!privada && <p className="mb-4 rounded bg-amber-100 p-3 text-amber-800">Únete a una privada antes de añadir contactos.</p>}{error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}{loading ? <p className="py-20 text-center text-xl text-[#0a496a]">Cargando directorio...</p> : <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">{filtered.map((item) => <article key={item.id} onClick={() => openView(item)} className="cursor-pointer rounded-[20px] bg-white p-5 shadow"><h2 className="text-xl font-bold text-slate-900">{item.nombre}</h2><span className="rounded bg-[#c8f0bf] px-2 py-1 text-sm text-[#215d2d]">{item.categorias}</span><p className="mt-4 flex items-center gap-2"><IoCallOutline/> {item.num_tel || "Sin teléfono"}</p><p className="text-sm text-slate-700">{item.descripcion || item.ubicacion || "Sin descripción"}</p><div className="mt-4 flex justify-end gap-3"><button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="flex items-center gap-1 rounded bg-[#ffd58d] px-3 py-2"><IoPencilOutline/>Editar</button><button onClick={(e) => { e.stopPropagation(); openDelete(item); }} className="flex items-center gap-1 rounded bg-[#ffb9b9] px-3 py-2"><IoTrashOutline/>Eliminar</button></div></article>)}{!filtered.length && <p>No hay contactos para mostrar.</p>}</div>}

    <BaseModal
      open={modalType !== null}
      title={modalTitle}
      onClose={close}
      footer={(modalType === "create" || modalType === "edit") ? (
        <>
          <Button variant="secondary" onClick={close} style={{ flex: 1 }}>Cancelar</Button>
          <Button variant="primary" onClick={() => void submit()} loading={saving} style={{ flex: 1 }}>Guardar</Button>
        </>
      ) : modalType === "view" ? (
        <>
          <Button variant="secondary" onClick={close} style={{ flex: 1 }}>Regresar</Button>
          <Button variant="primary" onClick={() => selectedContact && openEdit(selectedContact)} style={{ flex: 1 }}>Editar</Button>
        </>
      ) : undefined}
    >
      {(modalType === "create" || modalType === "edit") && (
        <ContactForm form={form} onChange={updateForm} images={preview} onAddImages={onAddImages} onRemoveImage={onRemoveImage} />
      )}
      {modalType === "view" && selectedContact && <ContactDetails contact={selectedContact} />}
      {modalType === "delete" && selectedContact && (
        <DeleteConfirmation contact={selectedContact} onCancel={close} onConfirm={() => void confirmDelete()} saving={saving} />
      )}
    </BaseModal>
  </main></div>;
}
