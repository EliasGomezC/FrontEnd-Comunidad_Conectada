"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCameraOutline, IoPerson } from "react-icons/io5";
import { useAuth } from "@/features/authentication/AuthContext";
import { fetchApiAuth } from "@/lib/api";
import type { Perfil } from "@/types/auth";

export default function PerfilPage() {
  const { token, user, isAuthenticated, isLoading, reloadUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nombres: "", apellidos: "", telefono: "", numero_casa: "", codigo_postal: "", bio: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const avatarPreview = useMemo(() => avatar ? URL.createObjectURL(avatar) : user?.perfil?.avatar, [avatar, user?.perfil?.avatar]);

  useEffect(() => () => {
    if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (user?.perfil) {
      const profile = user.perfil;
      queueMicrotask(() => setForm({
        nombres: profile.nombres, apellidos: profile.apellidos, telefono: profile.telefono,
        numero_casa: profile.numero_casa, codigo_postal: profile.codigo_postal, bio: profile.bio,
      }));
    }
  }, [isLoading, isAuthenticated, router, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(""); setMessage("");
    try {
      await fetchApiAuth<Perfil>("/api/perfiles/me/", token, { method: "PATCH", body: JSON.stringify(form) });
      if (avatar) {
        const body = new FormData();
        body.append("avatar", avatar);
        await fetchApiAuth<Perfil>("/api/perfiles/me/", token, { method: "POST", body });
      }
      await reloadUser();
      setAvatar(null);
      setMessage("Perfil actualizado correctamente.");
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo actualizar el perfil."); }
    finally { setSaving(false); }
  };

  if (isLoading || !isAuthenticated) return <div className="min-h-screen grid place-items-center">Cargando...</div>;
  return <main className="min-h-screen bg-[#e0e5eb] p-6"><form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl bg-white p-7 shadow">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-extrabold text-[#0a496a]">Mi perfil</h1><p className="mt-1 text-gray-600">{user?.email}</p></div><button type="button" onClick={() => router.back()} className="rounded-lg bg-[#0a496a] px-4 py-2 font-semibold text-white">Volver</button></div>
    <label className="relative mx-auto mt-7 grid h-36 w-36 cursor-pointer place-items-center overflow-hidden rounded-full border-4 border-[#0a496a] bg-sky-100 text-6xl text-[#0a496a] shadow">
      {avatarPreview ? <img src={avatarPreview} alt="Foto de perfil" className="h-full w-full object-cover" /> : <IoPerson />}
      <span className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-[#0a496a] text-xl text-white"><IoCameraOutline /></span>
      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
    </label>
    <p className="mt-2 text-center text-xs text-gray-500">JPG, PNG o WEBP · máximo 8 MB</p>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">{(Object.keys(form) as Array<keyof typeof form>).map((field) => <label key={field} className="flex flex-col gap-2 text-sm font-semibold capitalize text-gray-700">{field.replaceAll("_", " ")}<input value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} className="h-11 rounded-xl border px-3 font-normal outline-none focus:border-[#0a496a]" /></label>)}</div>
    {message && <p className="mt-4 rounded-lg bg-green-100 p-3 text-green-800">{message}</p>}{error && <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
    <button disabled={saving} className="mt-6 h-12 w-full rounded-xl bg-[#0a496a] font-bold text-white disabled:opacity-50">{saving ? "Guardando…" : "Guardar cambios"}</button>
  </form></main>;
}
