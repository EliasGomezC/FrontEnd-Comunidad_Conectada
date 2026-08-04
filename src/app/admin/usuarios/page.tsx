"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { IoClose, IoEyeOutline, IoPerson, IoSearchOutline } from "react-icons/io5";
import { useAuth } from "@/features/authentication/AuthContext";
import Sidebar from "@/components/Sidebar";
import { actualizarAvatarUsuario, agregarUsuarioPrivada, editarUsuarioPrivada, getUsuarios } from "@/services/usuarios";
import type { Usuario, UsuarioMembresia } from "@/types/usuarios";

type Rol = "moderador" | "habitante";
type Estado = "activo" | "suspendido";

const fecha = (value?: string | null) => value ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value)) : "—";
const nombre = (u: Usuario) => u.nombre_completo || `${u.perfil?.nombres || u.first_name} ${u.perfil?.apellidos || u.last_name}`.trim() || u.username;
const errorTexto = (error: unknown) => error instanceof Error ? error.message : "Ocurrió un error inesperado.";

function Modal({ children, onClose, narrow = false }: { children: React.ReactNode; onClose: () => void; narrow?: boolean }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" onMouseDown={onClose}>
    <div className={`relative max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-[#f7f9fc] p-7 shadow-2xl ${narrow ? "max-w-lg" : "max-w-2xl"}`} onMouseDown={(e) => e.stopPropagation()}>
      <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-5 top-5 text-3xl text-slate-700"><IoClose /></button>
      {children}
    </div>
  </div>;
}

function Avatar({ user, large = false }: { user: Usuario; large?: boolean }) {
  return <div className={`${large ? "h-36 w-36 text-7xl" : "h-20 w-20 text-4xl"} grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-indigo-200 text-indigo-700 shadow`}>
    {user.perfil?.avatar ? <img src={user.perfil.avatar} alt={`Foto de ${nombre(user)}`} className="h-full w-full object-cover" /> : <IoPerson />}
  </div>;
}

export default function UsuariosPage() {
  const { token, activeMembership, user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [editing, setEditing] = useState(false);
  const privada = activeMembership?.privada;

  const cargar = useCallback(async () => {
    if (!token || !privada) return;
    setLoading(true); setError("");
    try {
      const data = await getUsuarios(token, { privada, search: search || undefined, page });
      setUsuarios(data.results); setCount(data.count);
    } catch (e) { setError(errorTexto(e)); }
    finally { setLoading(false); }
  }, [token, privada, search, page]);
  // La consulta sincroniza la tabla con los filtros y la privada activa.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void cargar(); }, [cargar]);

  const totalPages = Math.max(1, Math.ceil(count / 10));
  if (activeMembership?.rol !== "moderador") return <div className="p-10 text-xl">Este módulo es exclusivo para moderadores.</div>;

  return <div className="flex min-h-screen bg-[#e5ebf1]"><Sidebar activeItem="Usuarios" /><main className="min-w-0 flex-1 p-5 text-[#073f60] md:p-10">
    <div className="mx-auto max-w-7xl">
      <h1 className="text-4xl font-extrabold">Gestión de Usuarios</h1>
      <p className="mt-1 text-xl leading-tight">Administración de todos los<br />usuarios de la privada residencial</p>
      <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row">
        <label className="flex max-w-2xl flex-1 items-center gap-4 rounded-xl bg-white px-5 shadow">
          <IoSearchOutline className="text-3xl" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre o email" className="w-full py-4 outline-none" />
        </label>
        <button onClick={() => setAddOpen(true)} className="rounded-xl border border-slate-900 bg-[#075574] px-7 py-3 font-bold text-white shadow">＋ Agregar Usuario</button>
      </div>
      {error && <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}
      <div className="mt-7 overflow-hidden rounded-b-[2rem] bg-white shadow-lg">
        <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left">
          <thead className="bg-[#075574] text-white"><tr>{["Nombre Completo", "Correo Electrónico", "Fecha de Ingreso", "Fecha de Inactividad", "Rol", "Más"].map(h => <th key={h} className="px-6 py-5 text-lg">{h}</th>)}</tr></thead>
          <tbody>{loading ? <tr><td colSpan={6} className="p-10 text-center">Cargando usuarios…</td></tr> : usuarios.length === 0 ? <tr><td colSpan={6} className="p-10 text-center">No se encontraron usuarios.</td></tr> : usuarios.map(u => {
            const m = u.membresias?.[0]; const inactive = m?.status === "suspendido";
            return <tr key={u.id} onClick={() => setSelected(u)} className={`cursor-pointer border-b border-white transition hover:brightness-95 ${inactive ? "bg-red-200" : "odd:bg-slate-100 even:bg-slate-50"}`}>
              <td className="px-6 py-5 font-semibold">{nombre(u)}</td><td className="px-6 py-5">{u.email}</td><td className="px-6 py-5">{fecha(m?.fecha_ingreso)}</td><td className="px-6 py-5">{fecha(m?.fecha_inactividad)}</td>
              <td className="px-6 py-5"><span className={`rounded-lg px-4 py-2 ${m?.rol === "moderador" ? "bg-indigo-300" : "bg-amber-200"}`}>● {m?.rol === "moderador" ? "Moderador" : "Habitante"}</span></td>
              <td className="px-6 py-5"><button aria-label="Ver usuario" className="text-3xl"><IoEyeOutline /></button></td>
            </tr>;
          })}</tbody>
        </table></div>
        <div className="flex items-center gap-3 p-5"><button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-full bg-[#075574] px-4 py-2 text-white disabled:opacity-40">‹</button><span>Página {page} de {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-full bg-[#075574] px-4 py-2 text-white disabled:opacity-40">›</button></div>
      </div>
    </div>
    {addOpen && token && privada && <AgregarModal token={token} privada={privada} onClose={() => setAddOpen(false)} onSaved={() => { setAddOpen(false); void cargar(); }} />}
    {selected && !editing && <DetalleModal user={selected} canEdit={selected.id !== user?.id} onClose={() => setSelected(null)} onEdit={() => setEditing(true)} />}
    {selected && editing && token && privada && <EditarModal token={token} privada={privada} user={selected} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); setSelected(null); void cargar(); }} />}
  </main></div>;
}

function AgregarModal({ token, privada, onClose, onSaved }: { token: string; privada: string; onClose: () => void; onSaved: () => void }) {
  const [email, setEmail] = useState(""); const [rol, setRol] = useState<Rol>("habitante"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setError(""); try { await agregarUsuarioPrivada(token, privada, { email, rol }); onSaved(); } catch (x) { setError(errorTexto(x)); } finally { setBusy(false); } };
  return <Modal onClose={onClose} narrow><form onSubmit={submit} className="pt-5"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-200 text-4xl"><IoPerson /></div><h2 className="mt-4 text-center text-2xl font-bold">Agregar usuario</h2><p className="mt-3 text-center text-slate-600">Ingresa el correo electrónico de una cuenta registrada para unirla a esta privada.</p>
    <label className="mt-7 block font-bold">Correo electrónico<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Escribe el correo del nuevo usuario" className="mt-2 w-full rounded-xl border p-4 font-normal" /></label>
    <label className="mt-5 block font-bold">Rol del usuario<select value={rol} onChange={e => setRol(e.target.value as Rol)} className="mt-2 w-full rounded-xl border bg-white p-4 font-normal"><option value="habitante">Habitante</option><option value="moderador">Moderador</option></select></label>
    {error && <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}<button disabled={busy} className="mt-7 w-full rounded-xl bg-green-300 p-4 font-bold disabled:opacity-50">{busy ? "Agregando…" : "Agregar"}</button></form></Modal>;
}

function DetalleModal({ user, canEdit, onClose, onEdit }: { user: Usuario; canEdit: boolean; onClose: () => void; onEdit: () => void }) {
  const m = user.membresias?.[0];
  return <Modal onClose={onClose}><div className="flex flex-col gap-5 pt-5 sm:flex-row"><Avatar user={user} large /><div className="flex-1 rounded-2xl bg-slate-100 p-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold text-slate-900">{nombre(user)}</h2><div className="flex flex-col gap-2"><span className={`rounded-lg px-4 py-2 ${m?.rol === "moderador" ? "bg-indigo-300" : "bg-amber-200"}`}>● {m?.rol === "moderador" ? "Moderador" : "Habitante"}</span><span className={`rounded-lg px-4 py-2 ${m?.status === "suspendido" ? "bg-red-300" : "bg-green-300"}`}>● {m?.status === "suspendido" ? "Inactivo" : "Activo"}</span></div></div><p className="mt-3">☎ {user.perfil?.telefono || "Sin teléfono registrado"}</p><p className="mt-3">✉ {user.email}</p></div></div>
    <div className="mt-5 grid gap-4 rounded-2xl bg-slate-100 p-5 sm:grid-cols-2"><div><b>Fecha de ingreso</b><p>{fecha(m?.fecha_ingreso)}</p></div><div><b>Fecha de inactividad</b><p>{fecha(m?.fecha_inactividad)}</p></div></div>
    <div className="mt-4 rounded-2xl bg-slate-100 p-5"><b>Actividad reciente</b><p className="mt-3 text-center text-slate-500">Sin actividad reciente del usuario.</p></div>
    <div className={`mt-7 grid gap-3 ${canEdit ? "grid-cols-2" : "grid-cols-1"}`}><button onClick={onClose} className="rounded-xl border border-[#075574] p-3 font-bold">Cerrar</button>{canEdit && <button onClick={onEdit} className="rounded-xl bg-[#315b78] p-3 font-bold text-white">Editar</button>}</div>{!canEdit && <p className="mt-3 text-center text-sm text-slate-500">Tu información es de solo lectura en esta sección.</p>}</Modal>;
}

function EditarModal({ token, privada, user, onClose, onSaved }: { token: string; privada: string; user: Usuario; onClose: () => void; onSaved: () => void }) {
  const membership = user.membresias?.[0] as UsuarioMembresia | undefined;
  const [rol, setRol] = useState<Rol>(membership?.rol || "habitante"); const [estado, setEstado] = useState<Estado>(membership?.status || "activo"); const [avatar, setAvatar] = useState<File | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const preview = useMemo(() => avatar ? URL.createObjectURL(avatar) : user.perfil?.avatar, [avatar, user.perfil?.avatar]);
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setError(""); try { await editarUsuarioPrivada(token, privada, user.id, { rol, status: estado }); if (avatar) await actualizarAvatarUsuario(token, privada, user.id, avatar); onSaved(); } catch (x) { setError(errorTexto(x)); } finally { setBusy(false); } };
  return <Modal onClose={onClose} narrow><form onSubmit={submit} className="pt-3"><label className="relative mx-auto grid h-40 w-40 cursor-pointer place-items-center overflow-hidden rounded-2xl bg-amber-200 text-7xl shadow">{preview ? <img src={preview} alt="Vista previa" className="h-full w-full object-cover" /> : <IoPerson />}<span className="absolute bottom-1 right-1 rounded bg-white px-2 text-xl">✎</span><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => setAvatar(e.target.files?.[0] || null)} /></label><h2 className="mt-4 text-center text-xl font-bold text-slate-900">{nombre(user)}</h2>
    <label className="mt-7 block font-bold">Rol del usuario<select value={rol} onChange={e => setRol(e.target.value as Rol)} className="mt-2 w-full rounded-xl border bg-white p-4 font-normal"><option value="habitante">Habitante</option><option value="moderador">Moderador</option></select></label>
    <label className="mt-5 block font-bold">Estado del usuario<select value={estado} onChange={e => setEstado(e.target.value as Estado)} className="mt-2 w-full rounded-xl border bg-white p-4 font-normal"><option value="activo">Activo</option><option value="suspendido">Inactivo</option></select></label>
    {error && <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}<div className="mt-7 grid grid-cols-2 gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-[#075574] p-3 font-bold">Cancelar</button><button disabled={busy} className="rounded-xl bg-[#315b78] p-3 font-bold text-white disabled:opacity-50">{busy ? "Guardando…" : "Editar"}</button></div></form></Modal>;
}
