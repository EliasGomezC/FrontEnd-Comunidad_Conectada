"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getUsuarios } from "@/services/usuarios";
import { Usuario } from "@/types/usuarios";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { IoEyeOutline } from "react-icons/io5";

const UsuariosPage = () => {
  const { token, logout, activeMembership } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token || !activeMembership) return;

    const fetchUsuarios = async () => {
      try {
        setIsLoading(true);
        const data = await getUsuarios(token, {
          privada: activeMembership.privada,
          search: searchTerm || undefined,
          page: currentPage,
        });
        setUsuarios(data.results);
        setTotalPages(Math.max(1, Math.ceil(data.count / 20)));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar usuarios");
        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, [token, activeMembership, currentPage, searchTerm, logout]);

  const roleToLabel: Record<string, "Moderador" | "Habitante"> = {
    admin: "Moderador",
    moderador: "Moderador",
    habitante: "Habitante",
  };

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Usuarios" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-start gap-5 flex-wrap mb-8">
          <div>
            <h1 className="m-0 text-[52px] text-[#124b70]">Gestión de Usuarios</h1>
            <p className="m-0 text-[18px] text-[#295c7f]">Administración de todos los usuarios de la privada residencial</p>
            <SearchBar 
              placeholder="Buscar por nombre o email" 
              className="w-[570px] max-w-full mt-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#0a496a] text-white border-none p-4 rounded-[14px] cursor-pointer hover:bg-[#0d5a80] text-lg">
            ＋ Agregar Usuario
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#0a496a] text-xl">Cargando usuarios...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="mt-6 bg-white rounded-[0_0_28px_28px] overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#0a496a] text-white">
                    <th className="p-[18px] text-left">Nombre Completo</th>
                    <th className="p-[18px] text-left">Correo electrónico</th>
                    <th className="p-[18px] text-left">Núm de Casa</th>
                    <th className="p-[18px] text-left">Fecha de Ingreso</th>
                    <th className="p-[18px] text-left">Rol</th>
                    <th className="p-[18px] text-left">Más</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${index % 2 === 0 ? "bg-[#eef2f6]" : "bg-white"}`}
                    >
                      <td className="p-4 text-slate-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="p-4 text-slate-900">{user.email}</td>
                      <td className="p-4 text-slate-900">-</td>
                      <td className="p-4 text-slate-900">
                        {new Date(user.date_joined).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-slate-900">
                        <StatusBadge status={roleToLabel[user.role || "habitante"]} />
                      </td>
                      <td className="p-4 text-slate-900">
                        <IoEyeOutline size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UsuariosPage;
