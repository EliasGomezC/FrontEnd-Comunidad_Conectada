"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoCopy, IoDocumentTextOutline } from "react-icons/io5";
import HabitantePage from "@/components/HabitantePage";
import { useAuth } from "@/features/authentication/AuthContext";
import { actualizarConfiguracionPrivada, getConfiguracionPrivada } from "@/services/configuracion-privada";
import type { ConfiguracionPrivada } from "@/types/configuracion-privada";

const TinyMCEEditor = dynamic(() => import("@/components/TinyMCEEditor"), { ssr: false, loading: () => <div className="grid h-[520px] place-items-center rounded-xl border bg-slate-50">Cargando editor...</div> });

export default function ConfiguracionPrivadaPage() {
  const { token, activeMembership, reloadUser } = useAuth();
  const [data, setData] = useState<ConfiguracionPrivada | null>(null);
  const [nombre, setNombre] = useState("");
  const [contenido, setContenido] = useState("");
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!token || !activeMembership) return;
    getConfiguracionPrivada(token, activeMembership.privada).then((response) => {
      setData(response); setNombre(response.privada.nombre); setContenido(response.reglamento.contenido);
    }).catch((e) => setError(e instanceof Error ? e.message : "No se pudo cargar la configuración.")).finally(() => setLoading(false));
  }, [token, activeMembership]);

  const guardar = async () => {
    if (!token || !activeMembership) return;
    setSaving(true); setError("");
    try {
      const updated = await actualizarConfiguracionPrivada(token, activeMembership.privada, { nombre, contenido });
      setData(updated); setNombre(updated.privada.nombre); setContenido(updated.reglamento.contenido);
      await reloadUser(); setEditando(false); setNotice("Los cambios se guardaron correctamente.");
      setTimeout(() => setNotice(""), 2500);
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudieron guardar los cambios."); }
    finally { setSaving(false); }
  };

  const copiar = async () => { if (!data) return; await navigator.clipboard.writeText(data.privada.codigo); setNotice("Código copiado."); setTimeout(() => setNotice(""), 1800); };

  return <HabitantePage activeItem="">
    <div className="mx-auto max-w-6xl text-[#0a496a]">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold">Mi privada</h1><p className="mt-1 text-lg text-[#295c7f]">Información institucional y reglamento residencial</p></div><Link href="/lobby" className="rounded-xl border-2 border-[#0a496a] px-5 py-3 font-bold">Cambiar de privada</Link></div>
      {notice && <p className="mt-5 flex items-center gap-2 rounded-xl bg-green-100 p-4 text-green-800"><IoCheckmarkCircle />{notice}</p>}
      {error && <p className="mt-5 rounded-xl bg-red-100 p-4 text-red-700">{error}</p>}
      {loading ? <p className="py-24 text-center text-xl">Cargando...</p> : data && <>
        <section className="mt-7 grid gap-5 rounded-3xl bg-white p-6 shadow md:grid-cols-[1fr_auto]">
          <div><label className="text-sm font-bold text-slate-600">Nombre de la privada</label>{editando ? <input value={nombre} maxLength={150} onChange={e => setNombre(e.target.value)} className="mt-2 w-full rounded-xl border p-3 text-xl font-bold" /> : <h2 className="mt-1 text-2xl font-bold">{data.privada.nombre}</h2>}</div>
          <div><p className="text-sm font-bold text-slate-600">Código de invitación</p><div className="mt-2 flex items-center gap-2"><code className="rounded-lg bg-sky-100 px-4 py-3 text-lg font-bold tracking-wider">{data.privada.codigo}</code><button onClick={copiar} className="rounded-lg bg-[#0a496a] p-3 text-white" title="Copiar código"><IoCopy size={22}/></button></div></div>
        </section>
        <section className="mt-7 rounded-3xl bg-white p-6 shadow">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 className="flex items-center gap-2 text-2xl font-bold"><IoDocumentTextOutline/> Reglamento</h2><p className="text-sm text-slate-500">{data.reglamento.actualizado_por_nombre ? `Actualizado por ${data.reglamento.actualizado_por_nombre} · ${new Date(data.reglamento.updated_at).toLocaleString("es-MX")}` : "Aún no se ha publicado un reglamento."}</p></div>{data.puede_editar && !editando && <button onClick={() => setEditando(true)} className="rounded-xl bg-[#0a496a] px-6 py-3 font-bold text-white">Editar reglamento</button>}</div>
          {editando ? <><TinyMCEEditor value={contenido} onChange={setContenido}/><div className="mt-5 flex justify-end gap-3"><button onClick={() => { setEditando(false); setNombre(data.privada.nombre); setContenido(data.reglamento.contenido); }} className="rounded-xl border-2 border-[#0a496a] px-6 py-3 font-bold">Cancelar</button><button disabled={saving || nombre.trim().length < 3} onClick={guardar} className="rounded-xl bg-[#0a496a] px-6 py-3 font-bold text-white disabled:opacity-50">{saving ? "Guardando..." : "Guardar cambios"}</button></div></> : data.reglamento.contenido ? <article className="max-w-none rounded-2xl border border-slate-200 p-7 text-base leading-7 text-slate-800 [&_a]:font-semibold [&_a]:text-sky-700 [&_a]:underline [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-700 [&_blockquote]:pl-5 [&_blockquote]:italic [&_h1]:mb-5 [&_h1]:mt-8 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h2]:mb-4 [&_h2]:mt-7 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-bold [&_h4]:mb-2 [&_h4]:mt-5 [&_h4]:text-xl [&_h4]:font-bold [&_h5]:mb-2 [&_h5]:mt-4 [&_h5]:text-lg [&_h5]:font-bold [&_h6]:mb-2 [&_h6]:mt-4 [&_h6]:font-bold [&_hr]:my-7 [&_hr]:border-slate-300 [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-8 [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-white [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-3 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-sky-100 [&_th]:p-3 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-8" dangerouslySetInnerHTML={{ __html: data.reglamento.contenido }} /> : <div className="rounded-2xl bg-slate-50 p-12 text-center text-slate-500">El Moderador todavía no ha publicado el reglamento de esta privada.</div>}
        </section>
      </>}
    </div>
  </HabitantePage>;
}
