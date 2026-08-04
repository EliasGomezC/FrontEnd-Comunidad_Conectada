"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/authentication/AuthContext";
import { crearPrivada, getMisPrivadas, getModulosSistema, unirseAPrivada } from "@/services/privadas";
import type { ModuloSistema } from "@/types/privadas";
import type { Membership } from "@/types/auth";
import { IoArrowForward } from "react-icons/io5";

export default function LobbyPage() {
  const { token, user, isAuthenticated, isLoading, logout, selectPrivate } = useAuth();
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [inactivePrivate, setInactivePrivate] = useState<Membership | null>(null);
  const [systemModules, setSystemModules] = useState<ModuloSistema[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const [address, setAddress] = useState({ numExterior: "", colonia: "", calle: "", cp: "", ciudad: "", estado: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (token) {
      getMisPrivadas(token).then(setMemberships).catch(() => undefined);
      getModulosSistema(token).then((modules) => {
        setSystemModules(modules);
        setSelectedModules(modules.map((module) => module.codigo));
      }).catch(() => undefined);
    }
  }, [token]);

  const join = async () => {
    if (!token || !code.trim()) return;
    setWorking(true); setError(""); setNotice("");
    try {
      const result = await unirseAPrivada(token, code);
      setMemberships((current) => [...current, result.membresia]);
      setCode("");
      setNotice(`Te uniste a ${result.privada.nombre}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo unir a la privada.");
    } finally { setWorking(false); }
  };

  const create = async () => {
    if (!token || !name.trim()) return;
    setWorking(true); setError(""); setNotice("");
    try {
      const result = await crearPrivada(token, {
        nombre: name.trim(),
        modulos_contratados: selectedModules,
        dir_num_exterior: address.numExterior.trim(),
        dir_colonia: address.colonia.trim(),
        dir_calle: address.calle.trim(),
        dir_cp: address.cp.trim(),
        dir_ciudad: address.ciudad.trim(),
        dir_estado: address.estado.trim(),
      });
      setMemberships((current) => [...current, result.membresia]);
      setName("");
      setAddress({ numExterior: "", colonia: "", calle: "", cp: "", ciudad: "", estado: "" });
      setNotice(`Privada creada. Tu código es: ${result.privada.codigo}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la privada.");
    } finally { setWorking(false); }
  };

  const enterPrivate = (membership: Membership) => {
    if (membership.status === "suspendido") {
      setInactivePrivate(membership);
      return;
    }
    selectPrivate(membership);
    router.push(membership.rol === "moderador" ? "/admin/pagos" : "/pagos");
  };

  if (isLoading || !isAuthenticated) return <div className="min-h-screen grid place-items-center">Cargando...</div>;

  return (
    <main className="min-h-screen bg-[#e0e5eb] p-6 text-[#374151]">
      <header className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl bg-[#0a496a] px-6 py-4 text-white shadow-md">
        <div><p className="text-sm opacity-80">Bienvenido</p><h1 className="text-xl font-bold">{user?.perfil?.nombres || user?.email}</h1></div>
        <div className="flex items-center gap-2">
          <Link href="/perfil" className="rounded-lg bg-white px-4 py-2 font-semibold text-[#0a496a]">Mi perfil</Link>
          <button onClick={logout} className="rounded-lg border border-white px-4 py-2 font-semibold text-white hover:bg-white/10">Cerrar sesión</button>
        </div>
      </header>

      <section className="mx-auto mt-8 max-w-5xl">
        <h2 className="text-3xl font-extrabold text-[#0a496a]">Tus privadas</h2>
        {memberships.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {memberships.map((membership) => <button type="button" onClick={() => enterPrivate(membership)} key={membership.id} className={`group rounded-xl p-5 text-left shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0a496a] ${membership.status === "suspendido" ? "border-2 border-red-300 bg-red-50" : "bg-white"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
            <h3 className="font-bold">{membership.privada_nombre}</h3>
            <p className="text-sm">Código: <strong>{membership.privada_codigo}</strong></p>
            <p className="mt-1 text-sm capitalize text-[#0a496a]">Rol: {membership.rol}</p>
              </div>
              <IoArrowForward className="mt-2 text-2xl text-[#0a496a] transition group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#0a496a]">Entrar a la privada</p>
            {membership.status === "suspendido" && <p className="mt-2 font-bold text-red-600">Cuenta inactiva</p>}
          </button>)}
        </div>}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Unirme a una privada</h2>
            <p className="mt-2 text-sm text-gray-600">Pide el código a un moderador.</p>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CC-XXXXXXXX" className="mt-5 h-12 w-full rounded-xl border px-4 uppercase outline-none focus:border-[#0a496a]" />
            <button onClick={join} disabled={working} className="mt-4 h-12 w-full rounded-xl bg-[#ffeBD1] font-bold text-[#4c4946] disabled:opacity-50">Unirme con código</button>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Crear una privada</h2>
            <p className="mt-2 text-sm text-gray-600">Al crearla serás su primer moderador.</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la privada" className="mt-5 h-12 w-full rounded-xl border px-4 outline-none focus:border-[#0a496a]" />
            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <p className="mb-3 text-sm font-bold text-[#0a496a]">Módulos de la plataforma contratados</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {systemModules.map((module) => (
                  <label key={module.codigo} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module.codigo)}
                      onChange={(event) => setSelectedModules((current) => event.target.checked ? [...current, module.codigo] : current.filter((code) => code !== module.codigo))}
                      className="h-4 w-4 accent-[#0a496a]"
                    />
                    {module.nombre}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {([['numExterior', 'Número exterior'], ['colonia', 'Colonia'], ['calle', 'Calle'], ['cp', 'Código postal'], ['ciudad', 'Ciudad'], ['estado', 'Estado']] as const).map(([field, placeholder]) => (
                <input key={field} value={address[field]} onChange={(e) => setAddress((current) => ({ ...current, [field]: e.target.value }))} placeholder={placeholder} className="h-11 rounded-xl border px-3 outline-none focus:border-[#0a496a]" />
              ))}
            </div>
            <button onClick={create} disabled={working} className="mt-4 h-12 w-full rounded-xl bg-[#c1e1c1] font-bold text-[#4c4946] disabled:opacity-50">Crear privada</button>
          </section>
        </div>
        {notice && <p className="mt-5 rounded-lg bg-green-100 p-3 text-center text-green-800">{notice}</p>}
        {error && <p className="mt-5 rounded-lg bg-red-100 p-3 text-center text-red-800">{error}</p>}
      </section>
      {inactivePrivate && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={() => setInactivePrivate(null)}><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl" onMouseDown={(e) => e.stopPropagation()}><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl">!</div><h2 className="mt-4 text-2xl font-bold text-[#0a496a]">Cuenta inactiva</h2><p className="mt-4 text-slate-600">Tu cuenta ha sido desactivada en <strong>{inactivePrivate.privada_nombre}</strong>. Por favor, contacta a un moderador de la privada para solicitar su reactivación.</p><button onClick={() => setInactivePrivate(null)} className="mt-7 w-full rounded-xl bg-[#0a496a] p-3 font-bold text-white">Entendido</button></div></div>}
    </main>
  );
}
