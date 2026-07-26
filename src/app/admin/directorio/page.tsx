"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getDirectorio } from "@/services/directorio";
import { DirectorioContacto } from "@/types/directorio";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import {
  IoShield, IoLeaf, IoConstructOutline, IoBulb, IoCutOutline,
  IoSparkles, IoCar, IoCamera, IoFlame,
  IoEyeOutline, IoPencilOutline, IoTrashOutline
} from "react-icons/io5";

const iconMap: Record<string, React.ReactNode> = {
  seguridad: <IoShield size={50} color="#12486d" />,
  seguridad_ciudadana: <IoShield size={50} color="#12486d" />,
  jardin: <IoLeaf size={50} color="#12486d" />,
  jardineria: <IoLeaf size={50} color="#12486d" />,
  mantenimiento: <IoConstructOutline size={50} color="#12486d" />,
  plomeria: <IoConstructOutline size={50} color="#12486d" />,
  electricista: <IoBulb size={50} color="#12486d" />,
  electricidad: <IoBulb size={50} color="#12486d" />,
  peluqueria: <IoCutOutline size={50} color="#12486d" />,
  corte_cabello: <IoCutOutline size={50} color="#12486d" />,
  limpieza: <IoSparkles size={50} color="#12486d" />,
  servicio_limpieza: <IoSparkles size={50} color="#12486d" />,
  agua: <IoCar size={50} color="#12486d" />,
  agua_potable: <IoCar size={50} color="#12486d" />,
  camaras: <IoCamera size={50} color="#12486d" />,
  security_cam: <IoCamera size={50} color="#12486d" />,
  gas: <IoFlame size={50} color="#12486d" />,
};

const defaultIcon = <IoCar size={50} color="#12486d" />;

const DirectorioPage = () => {
  const { token, logout, activeMembership } = useAuth();
  const [contactos, setContactos] = useState<DirectorioContacto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token || !activeMembership) return;

    const fetchDirectorio = async () => {
      try {
        setIsLoading(true);
        const data = await getDirectorio(token, { privada: activeMembership.privada });
        setContactos(data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar directorio");
        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectorio();
  }, [token, logout, activeMembership]);

  const filteredContactos = useMemo(() => {
    if (!searchTerm) return contactos;
    const term = searchTerm.toLowerCase();
    return contactos.filter(
      (contacto) =>
        contacto.nombre.toLowerCase().includes(term) ||
        contacto.categorias.toLowerCase().includes(term) ||
        contacto.descripcion?.toLowerCase().includes(term)
    );
  }, [contactos, searchTerm]);

  const getIcon = (categoria: string) => {
    const normalizedKey = categoria.toLowerCase().replace(/ /g, "_");
    return iconMap[normalizedKey] || defaultIcon;
  };

  return (
    <div className="flex min-h-screen bg-[#dde3ea]">
      <Sidebar activeItem="Directorio" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="text-[52px] m-0 mb-5 text-[#12486d]">Directorio Virtual</h1>
            <SearchBar 
              placeholder="Buscar contacto..." 
              className="w-[500px] max-w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#0a496a] text-white border-none px-[26px] py-[18px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80]">
            + Añadir Contacto
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#0a496a] text-xl">Cargando directorio...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 mt-8">
            {filteredContactos.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-[20px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h2 className="m-0 text-xl text-slate-900">{contact.nombre}</h2>
                    <span className="inline-block p-1 px-2 rounded-[8px] bg-[#c8f0bf] text-[#215d2d] text-sm mt-2">
                      {contact.categorias}
                    </span>
                    <p className="mt-2"><strong>Tel:</strong> {contact.num_tel || "Sin teléfono"}</p>
                    <small className="text-slate-900">{contact.ubicacion || "Sin ubicación especificada"}</small>
                  </div>
                  <div className="w-[150px] h-[130px] rounded-[14px] bg-[#d9e7f3] flex items-center justify-center">
                    {getIcon(contact.categorias)}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="flex items-center gap-1 px-[14px] py-[9px] border-none rounded-[8px] font-bold cursor-pointer bg-[#0a496a] text-white hover:bg-[#0d5a80]">
                    <IoEyeOutline size={18} /> Mostrar
                  </button>
                  <button className="flex items-center gap-1 px-[14px] py-[9px] border-none rounded-[8px] font-bold cursor-pointer bg-[#ffd58d] hover:bg-[#ffcc70]">
                    <IoPencilOutline size={18} /> Editar
                  </button>
                  <button className="flex items-center gap-1 px-[14px] py-[9px] border-none rounded-[8px] font-bold cursor-pointer bg-[#ffb9b9] hover:bg-[#ffa3a3]">
                    <IoTrashOutline size={18} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DirectorioPage;
