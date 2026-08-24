"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useAuth } from "@/features/authentication/AuthContext";
import "./fondo.css";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login({ email: email.trim(), password: password.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-top bg-no-repeat px-[30px] py-[20px] leading-[normal] tracking-[normal]"
      style={{
        backgroundImage: "linear-gradient(120deg, rgba(245, 247, 250, 0.8) 0%, rgba(10, 73, 106, 0.8) 100%), url('/Login-2@3x.png')",
      }}
    >
      <div className="fondo-cuadricula absolute inset-0 z-0 pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 m-0 flex w-full max-w-[578px] shrink-0 flex-col items-start justify-center gap-[23.2px] rounded-[26.5px] bg-[#f5f7fa] pt-[29.1px] pb-[29.2px] pl-[35px] pr-9 shadow-[0px_7.1px_16.8px_4.42px_rgba(0,_0,_0,_0.25)] hover:text-black mq578:max-w-full mq630:box-border mq630:pt-5 mq630:pb-5">
        <Link href="https://comunidadconectada.x10.mx/" className="flex h-[50.6px] w-[44.9px] items-center justify-center rounded-2xl bg-[#0a496a] pt-0 px-0 pb-[5.7px] box-border hover:bg-[#3A7594]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>

        <div className="self-stretch flex items-start px-px py-0 box-border max-w-full">
          <div className="flex max-w-full flex-1 items-center justify-center rounded-[25px] bg-[#c7e7fe] pt-1 px-0 pb-1 shadow-[0px_1px_4px_rgba(0,_0,_0,_0.25)] box-border">
            <div className="flex max-w-[370.1px] flex-1 flex-wrap content-end items-center justify-center gap-[3px]">
              <Image className="object-contain" loading="lazy" width={300} height={78} alt="Logo Comunidad Conectada" src="/assets/img/logoComunidadConectada.png" />
            </div>
          </div>
        </div>

        <div className="self-stretch flex max-w-full flex-col items-start gap-[9px] px-0 pt-[8.8px] pb-0 box-border">
          <b className="self-stretch text-left font-['Satoshi_Variable'] text-[15.8px] leading-[22.5px] text-[#374151]">Correo electrónico</b>
          <div className="self-stretch flex h-[51.7px] max-w-full items-start justify-center overflow-hidden rounded-[13.5px] border-[1.1px] border-solid border-[#e5e7eb] bg-[#f9fafb] px-[18px] py-2.5 box-border">
            <input
              className="h-[27px] w-full min-w-[250px] max-w-full flex-1 items-center border-none bg-transparent font-['Satoshi_Variable'] text-lg text-[#000000] outline-none"
              placeholder="tu@correo.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="self-stretch flex max-w-full flex-col items-start gap-[9px] px-0 pt-0 pb-3 box-border">
          <b className="self-stretch text-left font-['Satoshi_Variable'] text-[15.8px] leading-[22.5px] text-[#374151]">Contraseña</b>
          <div className="self-stretch flex h-[51.7px] max-w-full items-center gap-3 overflow-hidden rounded-[13.5px] border-[1.1px] border-solid border-[#e5e7eb] bg-[#f9fafb] px-[18px] py-2.5 box-border">
            <input
              className="h-[27px] min-w-0 flex-1 border-none bg-transparent font-['Satoshi_Variable'] text-lg text-[#000000] outline-none"
              placeholder="*******"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-[#000000]">
              {showPassword ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
            </button>
          </div>
        </div>

        <button className="self-stretch flex max-w-full items-start bg-transparent px-px py-0 box-border disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={isLoading}>
          <div className="flex max-w-full flex-1 items-center justify-center rounded-[10.6px] bg-[#0a496a] pt-[14.1px] px-0 pb-[13.9px] box-border hover:bg-[#3A7594]">
            <div className="inline-block max-w-full flex-1 text-center font-['Satoshi_Variable'] text-[18.2px] font-black leading-[150%] text-[#f5f7fa]">
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </div>
          </div>
        </button>

        {error && <p role="alert" className="m-0 self-stretch text-center text-sm text-red-700">{error}</p>}

        <div className="self-stretch flex items-center justify-center px-0 py-[2.8px]">
          <div className="flex w-[287.1px] max-w-[287px] flex-1 items-center text-right text-[18.2px] leading-[150%]">
            <span className="w-full">
              <span className="font-['Satoshi_Variable'] font-light leading-[150%] text-[#000]">{`¿No tienes una cuenta? `}</span>
              <Link href="/register" className="font-['Satoshi_Variable'] font-medium leading-[150%] text-[#0a496a] hover:text-[#3A7594]">
                Registrarse
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
