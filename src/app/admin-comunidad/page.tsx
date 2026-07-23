"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { actualizarModulosPrivada, cambiarPassword, crearAdmin, crearModulo, getAdminModulos, getAdminPrivadas, type AdminPrivate } from "@/services/admin";
import type { ModuloSistema } from "@/types/privadas";

export default function AdminComunidadPage() {
  const { token } = useAuth();
  const [privadas, setPrivadas] = useState<AdminPrivate[]>([]);
  const [modulos, setModulos] = useState<ModuloSistema[]>([]);
  const [message, setMessage] = useState("");
  const [adminForm, setAdminForm] = useState({ username: "", email: "", first_name: "", last_name: "", password: "", password_confirm: "" });
  const [passwordForm, setPasswordForm] = useState({ password_actual: "", password: "", password_confirm: "" });
  const [moduleForm, setModuleForm] = useState({ codigo: "", nombre: "", descripcion: "" });
  const [selectedModules, setSelectedModules] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!token) return;
    Promise.all([getAdminPrivadas(token), getAdminModulos(token)]).then(([privateData, moduleData]) => {
      setPrivadas(privateData); setModulos(moduleData);
      setSelectedModules(Object.fromEntries(privateData.map((privada) => [privada.id, privada.modulos_contratados])));
    }).catch((error) => setMessage(error instanceof Error ? error.message : "No se pudo cargar la administración."));
  }, [token]);

  const submitAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      await crearAdmin(token, adminForm);
      setMessage("Administrador creado correctamente.");
      setAdminForm({ username: "", email: "", first_name: "", last_name: "", password: "", password_confirm: "" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo crear el administrador."); }
  };

  const saveModules = async (privada: AdminPrivate) => {
    if (!token) return;
    try {
      await actualizarModulosPrivada(token, privada.id, selectedModules[privada.id] || []);
      setMessage(`Módulos actualizados para ${privada.nombre}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudieron actualizar los módulos."); }
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      await cambiarPassword(token, passwordForm);
      setPasswordForm({ password_actual: "", password: "", password_confirm: "" });
      setMessage("Contraseña actualizada correctamente.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo cambiar la contraseña."); }
  };

  const submitModule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      const module = await crearModulo(token, moduleForm);
      setModulos((current) => [...current, module].sort((a, b) => a.orden - b.orden));
      setModuleForm({ codigo: "", nombre: "", descripcion: "" });
      setMessage("Módulo creado correctamente.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo crear el módulo."); }
  };

  return <main className="min-h-screen bg-[#e0e5eb] p-8 text-[#374151]"><div className="mx-auto max-w-6xl">
    <h1 className="text-4xl font-extrabold text-[#0a496a]">Administración de Comunidad Conectada</h1>
    <p className="mt-2 text-gray-600">Control global de privadas, módulos contratados y administradores.</p>
    <section className="mt-8 grid gap-5 sm:grid-cols-2">{privadas.map((privada) => <article key={privada.id} className="rounded-2xl bg-white p-5 shadow"><h2 className="text-xl font-bold">{privada.nombre}</h2><p className="text-sm">Código: {privada.codigo}</p><p className="mt-2 font-semibold">{privada.habitantes} habitantes</p><div className="mt-3 grid gap-2">{modulos.map((modulo) => <label key={modulo.codigo} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={(selectedModules[privada.id] || []).includes(modulo.codigo)} onChange={(event) => setSelectedModules((current) => ({ ...current, [privada.id]: event.target.checked ? [...(current[privada.id] || []), modulo.codigo] : (current[privada.id] || []).filter((code) => code !== modulo.codigo) }))} />{modulo.nombre}</label>)}</div><button onClick={() => saveModules(privada)} className="mt-4 rounded-lg bg-[#0a496a] px-4 py-2 font-semibold text-white">Guardar módulos</button></article>)}</section>
    <section className="mt-8 rounded-2xl bg-white p-6 shadow"><h2 className="text-2xl font-bold">Catálogo de módulos</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{modulos.map((modulo) => <div key={modulo.id} className="rounded-lg border p-3"><strong>{modulo.nombre}</strong><p className="text-sm text-gray-600">{modulo.codigo}</p></div>)}</div></section>
    <form onSubmit={submitModule} className="mt-8 rounded-2xl bg-white p-6 shadow"><h2 className="text-2xl font-bold">Agregar módulo al catálogo</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{(Object.keys(moduleForm) as Array<keyof typeof moduleForm>).map((field) => <input key={field} required={field !== "descripcion"} value={moduleForm[field]} onChange={(event) => setModuleForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={field} className="h-11 rounded-lg border px-3" />)}</div><button className="mt-4 rounded-lg bg-[#0a496a] px-5 py-3 font-bold text-white">Agregar módulo</button></form>
    <form onSubmit={submitAdmin} className="mt-8 rounded-2xl bg-white p-6 shadow"><h2 className="text-2xl font-bold">Crear administrador</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{(Object.keys(adminForm) as Array<keyof typeof adminForm>).map((field) => <input key={field} required value={adminForm[field]} onChange={(event) => setAdminForm((current) => ({ ...current, [field]: event.target.value }))} type={field.includes("password") ? "password" : field === "email" ? "email" : "text"} placeholder={field.replaceAll("_", " ")} className="h-11 rounded-lg border px-3" />)}</div><button className="mt-4 rounded-lg bg-[#0a496a] px-5 py-3 font-bold text-white">Crear administrador</button></form>
    <form onSubmit={submitPassword} className="mt-8 rounded-2xl bg-white p-6 shadow"><h2 className="text-2xl font-bold">Cambiar mi contraseña</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{(Object.keys(passwordForm) as Array<keyof typeof passwordForm>).map((field) => <input key={field} required value={passwordForm[field]} onChange={(event) => setPasswordForm((current) => ({ ...current, [field]: event.target.value }))} type="password" placeholder={field.replaceAll("_", " ")} className="h-11 rounded-lg border px-3" />)}</div><button className="mt-4 rounded-lg bg-[#3a7594] px-5 py-3 font-bold text-white">Cambiar contraseña</button></form>
    {message && <p className="mt-5 rounded-lg bg-blue-100 p-3">{message}</p>}
  </div></main>;
}
