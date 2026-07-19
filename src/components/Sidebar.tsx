"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoPeople, IoDocumentText, IoBook, IoDocuments, IoStatsChart, IoCalendarClear, IoCube, IoCash } from "react-icons/io5";

interface SidebarProps {
  activeItem?: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "Usuarios", icon: <IoPeople className="h-6 w-6 shrink-0" />, href: "/admin/usuarios" },
  { label: "Reportes", icon: <IoDocumentText className="h-6 w-6 shrink-0" />, href: "/admin/reportes" },
  { label: "Reservaciones", icon: <IoBook className="h-6 w-6 shrink-0" />, href: "/admin/reservaciones" },
  { label: "Directorio", icon: <IoDocuments className="h-6 w-6 shrink-0" />, href: "/admin/directorio" },
  { label: "Encuestas", icon: <IoStatsChart className="h-6 w-6 shrink-0" />, href: "/admin/encuestas" },
  { label: "Eventos", icon: <IoCalendarClear className="h-6 w-6 shrink-0" />, href: "/admin/eventos" },
  { label: "Objetos Perdidos", icon: <IoCube className="h-6 w-6 shrink-0" />, href: "/admin/objetos-perdidos" },
  { label: "Pagos", icon: <IoCash className="h-6 w-6 shrink-0" />, href: "/admin/pagos" },
];

const Sidebar = ({ activeItem }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, label?: string) => {
    if (label) {
      return label.toLowerCase() === activeItem?.toLowerCase();
    }
    return pathname === href;
  };

  return (
    <aside className="w-[280px] bg-[#0a496a] text-white m-5 rounded-[30px] p-5 flex flex-col min-h-[95vh] shadow-lg">
      <div className="bg-[#dff1ff] text-[#0a496a] p-4 rounded-[14px] font-bold text-center">
        COMUNIDAD CONECTADA
      </div>

      <nav className="mt-6 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full no-underline transition-colors ${
              isActive(item.href, item.label)
                ? "bg-[#c9e8ff] text-[#0a496a] font-semibold"
                : "text-white hover:bg-[#c9e8ff] hover:text-[#0a496a]"
            }`}
          >
            {item.icon} <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto bg-[#dff1ff] text-[#0a496a] rounded-[24px] p-4 text-center">
        <strong>Usuario321</strong>
        <br />
        Moderador
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("comunidad-conectada-auth");
            router.replace("/login");
          }}
          className="mt-3 w-full rounded-lg border border-[#0a496a] bg-transparent px-3 py-2 text-sm font-semibold hover:bg-[#0a496a] hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
