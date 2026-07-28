"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoPeople, IoDocumentText, IoBook, IoDocuments, IoStatsChart, IoCalendarClear, IoCube, IoCash, IoCopy, IoCreateOutline, IoLogOutOutline, IoPerson } from "react-icons/io5";
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

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
  const displayName = [user?.perfil?.nombres || user?.first_name, user?.perfil?.apellidos || user?.last_name]
    .filter(Boolean).join(" ") || user?.email || "Usuario";
  const roleName = user?.role === "admin" ? "Administrador" : isModerator ? "Moderador" : "Habitante";

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

      <div ref={profileMenuRef} className="relative mt-auto">
        {profileMenuOpen && <div className="absolute bottom-[58px] right-0 z-30 w-[168px] overflow-hidden rounded-t-xl bg-[#dff1ff] py-2 text-[#0a496a] shadow-xl">
          <Link href="/perfil" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-white/70"><IoCreateOutline className="text-xl" />Editar Perfil</Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-left font-bold hover:bg-white/70"><IoLogOutOutline className="text-xl" />Cerrar sesión</button>
        </div>}
        <button type="button" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen(open => !open)} className="flex w-full items-center gap-3 rounded-[24px] bg-[#dff1ff] p-3 text-left text-[#0a496a] shadow transition hover:bg-white">
          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-[#0a496a] bg-sky-100 text-3xl">
            {user?.perfil?.avatar ? <img src={user.perfil.avatar} alt={`Foto de ${displayName}`} className="h-full w-full object-cover" /> : <IoPerson />}
          </span>
          <span className="min-w-0"><strong className="block truncate text-base leading-tight">{displayName}</strong><span className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-slate-900 ${isModerator ? "bg-[#aebcff]" : "bg-[#ffd9a3]"}`}><span className={`h-2 w-2 rounded-full ${isModerator ? "bg-[#4b70a6]" : "bg-amber-400"}`} />{roleName}</span></span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
