"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useAuth } from "@/features/authentication/AuthContext";
import './fondo.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      className="w-full min-h-screen relative flex flex-col items-center justify-center py-[20px] px-[30px] box-border bg-cover bg-no-repeat bg-top leading-[normal] tracking-[normal]" 
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(245, 247, 250, 0.8) 0%, rgba(10, 73, 106, 0.8) 100%), url('/Login-2@3x.png')`
      }}
    >
      {/* Capa de Cuadrícula: Totalmente independiente, fija en el fondo y no interfiere con los clicks */}
      <div className="fondo-cuadricula absolute inset-0 z-0 pointer-events-none" />

      {/* Formulario de Login: Ahora con z-10 para posicionarse arriba de la cuadrícula y perfectamente centrado */}
      <form onSubmit={handleSubmit} className="m-0 w-full relative z-10 shadow-[0px_7.1px_16.8px_4.42px_rgba(0,_0,_0,_0.25)] rounded-[26.5px] bg-[#f5f7fa] flex flex-col items-start justify-center pt-[29.1px] pb-[29.2px] pl-[35px] pr-9 box-border gap-[23.2px] max-w-[578px] shrink-0 mq578:max-w-full mq630:pt-5 mq630:pb-5 mq630:box-border hover:text-black">
        <Link href="https://comunidadconectada.x10.mx/" className="w-[44.9px] h-[50.6px] flex justify-center items-center pt-0 px-0 pb-[5.7px] box-border bg-[#0a496a] rounded-2xl hover:bg-[#3A7594]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
        
        <div className="self-stretch flex items-start py-0 px-px box-border max-w-full">
          <div className="flex-1 shadow-[0px_1px_4px_rgba(0,_0,_0,_0.25)] rounded-[25px] bg-[#c7e7fe] flex items-center justify-center pt-1 px-0 pb-1 box-border max-w-full">
            <div className="flex-1 flex items-center justify-center flex-wrap content-end gap-[3px] max-w-[370.1px]">
              <Image
                className="object-contain"
                loading="lazy"
                width={300}
                height={78}
                alt="Logo Comunidad Conectada"
                src="/assets/img/logoComunidadConectada.png"
              />
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col items-start pt-[8.8px] px-0 pb-0 box-border gap-[9px] max-w-full">
          <div className="self-stretch flex flex-col items-start">
            <b className="self-stretch relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151] text-left">
              Correo electrónico
            </b>
          </div>
          <div className="self-stretch h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] box-border overflow-hidden shrink-0 flex items-start justify-center py-2.5 px-[18px] max-w-full">
            <input
              className="w-full [border:none] [outline:none] bg-[transparent] h-[27px] flex-1 flex items-center font-['Satoshi_Variable'] text-lg text-[#000000] min-w-[250px] max-w-full"
              placeholder="tu@correo.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="self-stretch flex flex-col items-start pt-0 px-0 pb-3 box-border gap-[9px] max-w-full">
          <div className="self-stretch flex flex-col items-start">
            <b className="self-stretch relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151] text-left">
              Contraseña
            </b>
          </div>
          <div className="self-stretch h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] box-border overflow-hidden shrink-0 flex items-start justify-center py-2.5 px-[18px] max-w-full">
            <div className="flex-1 flex items-center flex-wrap content-center gap-0 max-w-full [row-gap:20px]">
              <input
                className="w-[calc(100%_-_18.9px)] [border:none] [outline:none] bg-[transparent] h-[27px] flex-1 overflow-hidden flex items-start font-['Satoshi_Variable'] text-lg text-[#000000] min-w-[281px] max-w-full"
                placeholder="*******"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hide text-[#000000] lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
          </div>
        </div>

        <button
          className="cursor-pointer [border:none] py-0 px-px bg-[transparent] self-stretch flex items-start box-border max-w-full disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          <div className="flex-1 rounded-[10.6px] bg-[#0a496a] hover:bg-[#3A7594] flex items-center justify-center pt-[14.1px] px-0 pb-[13.9px] box-border max-w-full">
            <div className="flex-1 relative text-[18.2px] leading-[150%] font-black font-['Satoshi_Variable'] text-[#f5f7fa] text-center inline-block max-w-full">
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </div>
          </div>
        </button>

        {error && <p role="alert" className="m-0 self-stretch text-center text-sm text-red-700">{error}</p>}

        <div className="self-stretch flex items-center justify-center py-[2.8px] px-0">
          <div className="flex-1 relative text-[18.2px] leading-[150%] text-right flex items-center w-[287.1px] shrink-0 max-w-[287px]">
            <span className="w-full">
              <span className="font-light font-['Satoshi_Variable'] text-[#000] leading-[150%]">{`¿No tienes una cuenta? `}</span>
              <Link href="/register" className="font-medium font-['Satoshi_Variable'] text-[#0a496a] hover:text-[#3A7594] leading-[150%]">
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
