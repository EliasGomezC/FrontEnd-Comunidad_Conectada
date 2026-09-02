"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useAuth } from "@/features/authentication/AuthContext";
import "../login/fondo.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    numero_casa: "",
    codigo_postal: "",
    password: "",
    password_confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<"idle" | "checking" | "match" | "mismatch">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchTimer, setMatchTimer] = useState<number | null>(null);

  const schedulePasswordCheck = (nextForm: typeof form) => {
    if (matchTimer) window.clearTimeout(matchTimer);
    if (!nextForm.password && !nextForm.password_confirm) {
      setPasswordMatch("idle");
      return;
    }
    setPasswordMatch("checking");
    const timer = window.setTimeout(() => {
      setPasswordMatch(nextForm.password === nextForm.password_confirm ? "match" : "mismatch");
    }, 250);
    setMatchTimer(timer);
  };

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    if (field === "password" || field === "password_confirm") schedulePasswordCheck(nextForm);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<[keyof typeof form, string, string, string]> = [
    ["nombres", "Nombres", "Escribe tus nombres", "text"],
    ["apellidos", "Apellidos", "Escribe tus apellidos", "text"],
    ["email", "Correo electrónico", "tu@correo.com", "email"],
    ["telefono", "Teléfono", "664-123-4567", "tel"],
    ["numero_casa", "Número de casa", "Ej. 24", "text"],
    ["codigo_postal", "Código postal", "Ej. 22000", "text"],
  ];

  const passwordStatus = passwordMatch === "match"
    ? "text-green-700"
    : passwordMatch === "mismatch"
      ? "text-red-700"
      : "text-slate-500";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e0e5eb] p-4 sm:p-6">
      <form onSubmit={submit} className="relative z-10 w-full max-w-2xl rounded-[26px] bg-[#f5f7fa] p-6 shadow-xl sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-extrabold text-[#0a496a]">Crear cuenta</h1>
          <p className="mt-2 text-gray-600">Regístrate como habitante y después únete o crea una privada.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([field, label, placeholder, type]) => (
            <label key={field} className="flex flex-col gap-2 text-sm font-semibold text-[#374151]">
              {label}
              <input
                required={!["telefono", "codigo_postal"].includes(field)}
                type={type}
                value={form[field]}
                onChange={update(field)}
                placeholder={placeholder}
                className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-base font-normal outline-none focus:border-[#0a496a]"
              />
            </label>
          ))}
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#374151]">
            Contraseña
            <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                placeholder="Mínimo 8 caracteres"
                className="min-w-0 flex-1 bg-transparent text-base font-normal outline-none"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-500">
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#374151]">
            Confirmar contraseña
            <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4">
              <input
                required
                type={showPasswordConfirm ? "text" : "password"}
                value={form.password_confirm}
                onChange={update("password_confirm")}
                placeholder="Repite tu contraseña"
                className="min-w-0 flex-1 bg-transparent text-base font-normal outline-none"
              />
              <button type="button" onClick={() => setShowPasswordConfirm((current) => !current)} className="text-slate-500">
                {showPasswordConfirm ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </label>
        </div>
        <p className={`mt-3 text-sm ${passwordStatus}`}>
          {passwordMatch === "checking" && "Verificando contraseñas..."}
          {passwordMatch === "match" && "Las contraseñas coinciden."}
          {passwordMatch === "mismatch" && "Las contraseñas no coinciden."}
        </p>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-6 h-12 w-full rounded-xl bg-[#0a496a] font-bold text-white hover:bg-[#3a7594] disabled:opacity-50">
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>
        <p className="mt-5 text-center text-gray-700">
          ¿Ya tienes una cuenta? <Link href="/login" className="font-semibold text-[#0a496a]">Iniciar sesión</Link>
        </p>
      </form>
    </main>
  );
}
