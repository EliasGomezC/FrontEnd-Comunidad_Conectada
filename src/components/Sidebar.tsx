"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoPeople, IoDocumentText, IoBook, IoDocuments, IoStatsChart, IoCalendarClear, IoCube, IoCash, IoCopy } from "react-icons/io5";
import { useAuth } from "@/features/authentication/AuthContext";

interface SidebarProps {
  activeItem?: string;
}

interface MenuItem {
  label: string;
  code: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  { code: "usuarios", label: "Usuarios", icon: <IoPeople className="h-6 w-6 shrink-0" />, href: "/admin/usuarios" },
  { code: "reportes", label: "Reportes", icon: <IoDocumentText className="h-6 w-6 shrink-0" />, href: "/admin/reportes" },
  { code: "reservaciones", label: "Reservaciones", icon: <IoBook className="h-6 w-6 shrink-0" />, href: "/admin/reservaciones" },
  { code: "directorio", label: "Directorio", icon: <IoDocuments className="h-6 w-6 shrink-0" />, href: "/admin/directorio" },
  { code: "encuestas", label: "Encuestas", icon: <IoStatsChart className="h-6 w-6 shrink-0" />, href: "/admin/encuestas" },
  { code: "eventos", label: "Eventos", icon: <IoCalendarClear className="h-6 w-6 shrink-0" />, href: "/admin/eventos" },
  { code: "objetos-perdidos", label: "Objetos Perdidos", icon: <IoCube className="h-6 w-6 shrink-0" />, href: "/admin/objetos-perdidos" },
  { code: "pagos", label: "Pagos", icon: <IoCash className="h-6 w-6 shrink-0" />, href: "/admin/pagos" },
];

const Sidebar = ({ activeItem }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout, isModerator, activeMembership } = useAuth();
  const isSystemAdmin = user?.role === "admin";
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const memberships = activeMembership ? [activeMembership] : [];
  const contractedModules = new Set(memberships.flatMap((m) => m.modulos_contratados || []) || []);
  const habitanteRoutes: Record<string, string> = {
    reportes: "/reportes",
    reservaciones: "/reservaciones",
    directorio: "/directorio",
    eventos: "/eventos-proyectos",
    "objetos-perdidos": "/objetos-perdidos",
    pagos: "/pagos",
  };
  const roleItems = isModerator ? menuItems : menuItems.filter((item) => !["usuarios", "encuestas"].includes(item.code)).map((item) => ({
    ...item,
    href: habitanteRoutes[item.code] || "/lobby",
    label: item.code === "eventos" ? "Eventos y proyectos" : item.label,
  }));
  const visibleMenuItems = isSystemAdmin ? menuItems : roleItems.filter((item) => contractedModules.has(item.code));

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch { /* fallback silencioso */ }
  };

  const isActive = (href: string, label?: string) => {
    if (label) {
      return label.toLowerCase() === activeItem?.toLowerCase();
    }
    return pathname === href;
  };

  return (
    <aside className="w-[280px] bg-[#0a496a] text-white m-5 rounded-[30px] p-5 flex flex-col min-h-[95vh] shadow-lg">
      <Link
        href="/lobby"
        aria-label="Ir al lobby para cambiar de privada"
        title="Cambiar de privada"
        className="block bg-[#dff1ff] text-[#0a496a] p-4 rounded-[14px] font-bold text-center transition hover:bg-white hover:shadow-md"
      >
        COMUNIDAD CONECTADA
      </Link>

      {!isSystemAdmin && memberships.map((m) => (
        <div key={m.id} className="mt-3 rounded-xl bg-white/10 p-3 text-center text-sm">
          <p className="text-xs opacity-70">{m.privada_nombre}</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <code className="rounded bg-white/20 px-2 py-0.5 font-mono text-base tracking-wider">{m.privada_codigo}</code>
            <button
              type="button"
              onClick={() => copyToClipboard(m.privada_codigo)}
              className="rounded p-1 hover:bg-white/20 transition-colors"
              title="Copiar código"
            >
              <IoCopy className="h-4 w-4" />
            </button>
          </div>
          {copiedCode === m.privada_codigo && <p className="mt-1 text-xs text-green-300">¡Copiado!</p>}
        </div>
      ))}

      {!isSystemAdmin && activeMembership && (
        <Link href="/lobby" className="mt-3 rounded-lg border border-white/40 px-3 py-2 text-center text-sm font-semibold hover:bg-white/10">
          Cambiar de privada
        </Link>
      )}

      <nav className="mt-6 flex flex-col gap-2">
        {isSystemAdmin && <Link href="/admin-comunidad" className="mb-3 flex items-center justify-center rounded-xl bg-[#c1e1c1] px-4 py-3 font-semibold text-[#234b31]">Administración global</Link>}
        {visibleMenuItems.map((item) => (
          <Link
            key={item.code}
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
        <strong>{user?.perfil?.nombres || user?.email || "Usuario"}</strong>
        <br />
        {user?.role === "admin" ? "Administrador" : isModerator ? "Moderador" : "Habitante"}
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-lg border border-[#0a496a] bg-transparent px-3 py-2 text-sm font-semibold hover:bg-[#0a496a] hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
