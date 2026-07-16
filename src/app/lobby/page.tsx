import type { NextPage } from "next";
import Image from "next/image";
import '../login/fondo.css';

const Lobby: NextPage = () => {
    return (
        <div className="w-full min-h-screen relative flex flex-col box-border bg-[#E0E5EB] leading-[normal] tracking-[normal]">
            {/* Capa de Cuadrícula: Fondo */}
            <div className="fondo-cuadricula absolute inset-0 z-0 pointer-events-none" />

            {/* Header */}
            <header className="w-full h-[70px] bg-[#0a496a] flex items-center justify-between px-[30px] shadow-md relative z-10">
                {/* <div className="w-[180px] h-[45px] rounded-[10px] bg-white flex items-center justify-center p-2 box-border">
                    <Image
                        className="object-contain"
                        width={120}
                        height={35}
                        alt="Logo Comunidad Conectada"
                        src="/assets/img/logoComunidadConectada.png"
                    />
                </div> */}
                <div>

                </div>
                <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#374151]"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="flex-1 w-full flex flex-col items-center justify-center gap-[40px] px-[30px] py-[50px] relative z-10">

                {/* Logo Central */}
                <div className="shadow-[0px_4px_10px_rgba(0,_0,_0,0.15)] rounded-[30px] bg-[#c7e7fe] flex items-center justify-center p-6">
                    <Image
                        className="object-contain"
                        width={150}
                        height={150}
                        alt="Logo Grande Comunidad Conectada"
                        src="/assets/img/iconCC.png" // Asumiendo que tienes un archivo solo para el icono grande
                    />
                </div>

                {/* Textos de Bienvenida */}
                <div className="text-center flex flex-col gap-3 max-w-[600px]">
                    <h1 className="m-0 text-[40px] leading-[1.2] font-extrabold font-['Satoshi_Variable'] text-[#000]">
                        Bienvenido a Comunidad Conectada
                    </h1>
                    <p className="m-0 text-[18px] leading-[1.5] font-medium font-['Satoshi_Variable'] text-[#374151]">
                        Aun no perteneces a ninguna privada residencial. Únete a una existente con un codigo de acceso o registra una nueva.
                    </p>
                </div>

                {/* Tarjetas de Opciones */}
                <div className="w-full flex flex-wrap items-center justify-center gap-[30px] max-w-[1000px]">

                    {/* Tarjeta 1: Unirme */}
                    <div className="flex-1 min-w-[300px] max-w-[400px] shadow-[0px_8px_20px_rgba(0,_0,_0,0.1)] rounded-[25px] bg-[#f5f7fa] flex flex-col items-center p-9 box-border gap-6 text-center hover:scale-[1.02] transition-transform duration-300">
                        <div className="w-[70px] h-[70px] rounded-[20px] bg-[#FFEBD1] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#4C4946" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <h3 className="m-0 text-[22px] font-bold font-['Satoshi_Variable'] text-[#000]">
                            Unirme con Código
                        </h3>
                        <p className="m-0 text-[16px] leading-[1.5] font-normal font-['Satoshi_Variable'] text-[#4B5563]">
                            Ingresa el código de acceso para unirte a una privada existente
                        </p>
                        <button className="w-full h-[50px] rounded-[15px] bg-[#FFEBD1] hover:bg-[#F3E0C8] border-none flex items-center justify-center gap-3 cursor-pointer group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C4946" strokeWidth="2.5" className="group-hover:rotate-12 transition-transform"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 15.5m.11-6.11A5.5 5.5 0 1 1 23.39 1.61a5.5 5.5 0 0 1-7.778 7.778z" /></svg>
                            <span className="text-[17px] font-bold font-['Satoshi_Variable'] text-[#4C4946]">Ingresa Código</span>
                        </button>
                    </div>

                    {/* Tarjeta 2: Registrar */}
                    <div className="flex-1 min-w-[300px] max-w-[400px] shadow-[0px_8px_20px_rgba(0,_0,_0,0.1)] rounded-[25px] bg-[#f5f7fa] flex flex-col items-center p-9 box-border gap-6 text-center hover:scale-[1.02] transition-transform duration-300">
                        <div className="w-[70px] h-[70px] rounded-[20px] bg-[#C1E1C1] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#4C4946" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <h3 className="m-0 text-[22px] font-bold font-['Satoshi_Variable'] text-[#000]">
                            Registrar Nueva Privada
                        </h3>
                        <p className="m-0 text-[16px] leading-[1.5] font-normal font-['Satoshi_Variable'] text-[#4B5563]">
                            Registra una nueva privada residencial y conviértete en su moderador
                        </p>
                        <button className="w-full h-[50px] rounded-[15px] bg-[#C1E1C1] hover:bg-[#B3D4B3] border-none flex items-center justify-center gap-3 cursor-pointer group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C4946" strokeWidth="2.5" className="group-hover:scale-110 transition-transform"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /><line x1="12" y1="15" x2="12" y2="19" /><line x1="10" y1="17" x2="14" y2="17" /></svg>
                            <span className="text-[17px] font-bold font-['Satoshi_Variable'] text-[#4C4946]">Nueva Privada</span>
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Lobby;