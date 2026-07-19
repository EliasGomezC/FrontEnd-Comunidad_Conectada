import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { IoEyeOutline } from "react-icons/io5";

interface User {
  id: number;
  name: string;
  email: string;
  houseNumber: string;
  joinDate: string;
  role: "Moderador" | "Habitante";
  isAlert?: boolean;
}

const users: User[] = [
  { id: 1, name: "Elias Jair Gomez Cueva", email: "eliasgcueva@gmail.com", houseNumber: "4371", joinDate: "04/Febrero/2026", role: "Moderador" },
  { id: 2, name: "Pedro Pérez Garcia", email: "pepe123@gmail.com", houseNumber: "1734", joinDate: "28/Enero/2026", role: "Habitante" },
  { id: 3, name: "Ariel Torres Iñiguez", email: "torresariel@gmail.com", houseNumber: "5236", joinDate: "28/Enero/2026", role: "Habitante" },
  { id: 4, name: "Daniel Martínez Bustamante", email: "martinez@gmail.com", houseNumber: "2359", joinDate: "28/Enero/2026", role: "Habitante" },
  { id: 5, name: "Alejandro Díaz Cervantes", email: "alediaz@gmail.com", houseNumber: "9745", joinDate: "28/Enero/2026", role: "Habitante" },
  { id: 6, name: "Angel Josué Alcántara", email: "aya@hotmail.com", houseNumber: "5348", joinDate: "28/Enero/2026", role: "Habitante" },
  { id: 7, name: "Victor Gabriel Chavez", email: "vitorgab@gmail.com", houseNumber: "2346", joinDate: "28/Enero/2026", role: "Habitante", isAlert: true },
];

const UsuariosPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Usuarios" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-start gap-5 flex-wrap mb-8">
          <div>
            <h1 className="m-0 text-[52px] text-[#124b70]">Gestión de Usuarios</h1>
            <p className="m-0 text-[18px] text-[#295c7f]">Administración de todos los usuarios de la privada residencial</p>
            <SearchBar placeholder="Buscar por nombre o email" className="w-[570px] max-w-full mt-3" />
          </div>
          <button className="bg-[#0a496a] text-white border-none p-4 rounded-[14px] cursor-pointer hover:bg-[#0d5a80] text-lg">
            ＋ Agregar Usuario
          </button>
        </div>

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
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-[#eef2f6]" : "bg-white"} ${user.isAlert ? "bg-[#ffc1c1]" : ""}`}
                >
                  <td className="p-4 text-slate-900">{user.name}</td>
                  <td className="p-4 text-slate-900">{user.email}</td>
                  <td className="p-4 text-slate-900">{user.houseNumber}</td>
                  <td className="p-4 text-slate-900">{user.joinDate}</td>
                  <td className="p-4 text-slate-900">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="p-4 text-slate-900"><IoEyeOutline size={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={1} totalPages={7} />
        </div>
      </main>
    </div>
  );
};

export default UsuariosPage;
