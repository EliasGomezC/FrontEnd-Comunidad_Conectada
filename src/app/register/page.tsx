import type { NextPage } from "next";
import Image from "next/image";
import Link from 'next/link';
import '../login/fondo.css';

const Register: NextPage = () => {
    return (
        <div
            className="w-full min-h-screen relative flex flex-col items-center justify-center py-[20px] px-[30px] box-border bg-cover bg-no-repeat bg-top leading-[normal] tracking-[normal]"
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(245, 247, 250, 0.8) 0%, rgba(10, 73, 106, 0.8) 100%), url(/Login-2@3x.png)'
            }}
        >
            {/* Capa de Cuadrícula: Totalmente independiente, fija en el fondo */}
            <div className="fondo-cuadricula absolute inset-0 z-0 pointer-events-none" />

            {/* Formulario de Register: Ampliado y con scroll interno */}
            <form className="m-0 w-full relative z-10 shadow-[0px_7.1px_16.8px_4.42px_rgba(0,_0,_0,_0.25)] rounded-[26.5px] bg-[#f5f7fa] flex flex-col items-center justify-center py-[29px] px-9 box-border gap-[20px] max-w-[800px] max-h-[85vh] overflow-y-auto shrink-0 mq578:max-w-full">

                {/* Botón Volver y Logo */}
                <div className="w-full flex items-center gap-[20px] mb-4">
                    <div className="flex-1 shadow-[0px_1px_4px_rgba(0,_0,_0,_0.25)] rounded-[25px] bg-[#c7e7fe] flex items-center justify-center pt-1 px-4 pb-1 box-border">
                        <Image
                            className="object-contain"
                            loading="lazy"
                            width={250}
                            height={65}
                            alt="Logo Comunidad Conectada"
                            src="/assets/img/logoComunidadConectada.png"
                        />
                    </div>
                </div>

                {/* Sección de Campos */}
                <div className="self-stretch flex flex-wrap gap-x-[20px] gap-y-[15px]">

                    {/* Primer Nombre */}
                    <div className="flex-[1_1_200px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Primer Nombre <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="Escribe tu primer nombre" type="text" />
                        </div>
                    </div>

                    {/* Segundo Nombre */}
                    <div className="flex-[1_1_200px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Segundo Nombre
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="Escribe tu segundo nombre" type="text" />
                        </div>
                    </div>

                    {/* Apellido Paterno */}
                    <div className="flex-[1_1_200px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Apellido Paterno
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="Escribe apellido paterno" type="text" />
                        </div>
                    </div>

                    {/* Apellido Materno */}
                    <div className="flex-[1_1_200px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Apellido Materno <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="Escribe apellido materno" type="text" />
                        </div>
                    </div>

                    {/* Correo Electrónico */}
                    <div className="w-full flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Correo electrónico <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="comunidadconectada@gmail.com" type="email" />
                        </div>
                    </div>

                    {/* Número de teléfono */}
                    <div className="flex-[1_1_150px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Número de teléfono <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="664-123-4567" type="tel" />
                        </div>
                    </div>

                    {/* Núm de casa */}
                    <div className="flex-[1_1_150px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Núm de casa <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="Escribe tu número de casa" type="text" />
                        </div>
                    </div>

                    {/* Código Postal */}
                    <div className="flex-[1_1_150px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Código Postal <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="Escribe tu código postal" type="text" />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="flex-[1_1_300px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Contraseña <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="*******" type="password" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black ml-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="flex-[1_1_300px] flex flex-col gap-2">
                        <b className="relative text-[15.8px] leading-[22.5px] font-['Satoshi_Variable'] text-[#374151]">
                            Confirmar contraseña <span className="text-red-500">*</span>
                        </b>
                        <div className="h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] flex items-center px-[18px]">
                            <input className="w-full [border:none] [outline:none] bg-[transparent] font-['Satoshi_Variable'] text-lg text-[#000000]" placeholder="*******" type="password" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black ml-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                    </div>

                </div>

                {/* Botón Registrarte */}
                <Link href="/lobby" className="cursor-pointer [border:none] p-0 bg-[transparent] w-full mt-4" type="submit">
                    <div className="w-full rounded-[10.6px] bg-[#0a496a] hover:bg-[#3A7594] flex items-center justify-center pt-[14.1px] pb-[13.9px] box-border">
                        <div className="relative text-[18.2px] leading-[150%] font-black font-['Satoshi_Variable'] text-[#f5f7fa] text-center">
                            
                            Registrarte
                            
                        </div>
                    </div>
                </Link>

                {/* Enlace a Iniciar Sesión */}
                <div className="w-full flex items-center justify-center text-[18.2px] leading-[150%]">
                    <span className="font-light font-['Satoshi_Variable'] text-[#000]">¿Ya tienes una cuenta? </span>
                    <Link href="/login" className="font-medium font-['Satoshi_Variable'] text-[#0a496a] hover:text-[#3A7594] ml-1">
                        Iniciar Sesión
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;