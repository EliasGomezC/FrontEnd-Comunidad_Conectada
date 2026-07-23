"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/authentication/AuthContext";
import { fetchApiAuth } from "@/lib/api";
import type { Perfil } from "@/types/auth";

export default function PerfilPage() {
  const { token, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nombres: "", apellidos: "", telefono: "", numero_casa: "", codigo_postal: "", bio: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    setError(""); setMessage("");
    try {
      await fetchApiAuth<Perfil>("/api/perfiles/me/", token, { method: "PATCH", body: JSON.stringify(form) });
      setMessage("Perfil actualizado correctamente.");
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo actualizar el perfil."); }
  };

  if (isLoading || !isAuthenticated) return <div className="min-h-screen grid place-items-center">Cargando...</div>;
  return <main className="min-h-screen bg-[#e0e5eb] p-6"><form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl bg-white p-7 shadow">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-extrabold text-[#0a496a]">Mi perfil</h1><p className="mt-1 text-gray-600">{user?.email}</p></div><Link href="/lobby" className="rounded-lg bg-[#0a496a] px-4 py-2 font-semibold text-white">Volver</Link></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">{(Object.keys(form) as Array<keyof typeof form>).map((field) => <label key={field} className="flex flex-col gap-2 text-sm font-semibold capitalize text-gray-700">{field.replaceAll("_", " ")}<input value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} className="h-11 rounded-xl border px-3 font-normal outline-none focus:border-[#0a496a]" /></label>)}</div>
    {message && <p className="mt-4 rounded-lg bg-green-100 p-3 text-green-800">{message}</p>}{error && <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
    <button className="mt-6 h-12 w-full rounded-xl bg-[#0a496a] font-bold text-white">Guardar cambios</button>
  </form></main>;
}
