"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
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
    ["password", "Contraseña", "Mínimo 8 caracteres", "password"],
    ["password_confirm", "Confirmar contraseña", "Repite tu contraseña", "password"],
  ];

  return (
    <main className="min-h-screen bg-[#e0e5eb] flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-2xl relative z-10 rounded-[26px] bg-[#f5f7fa] p-8 shadow-xl">
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
        </div>
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
