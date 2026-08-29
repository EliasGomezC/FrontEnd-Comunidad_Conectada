"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoPeople, IoDocumentText, IoBook, IoDocuments, IoClipboard, IoCalendarClear, IoCube, IoCash, IoCopy, IoCreateOutline, IoLogOutOutline, IoPerson, IoChevronDown, IoSettingsOutline, IoSwapHorizontal, IoMenu, IoClose } from "react-icons/io5";
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
  { code: "minutas", label: "Minutas", icon: <IoClipboard className="h-6 w-6 shrink-0" />, href: "/admin/minutas" },
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
  const [privateMenuOpen, setPrivateMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const privateMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setProfileMenuOpen(false);
      if (privateMenuRef.current && !privateMenuRef.current.contains(event.target as Node)) setPrivateMenuOpen(false);
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
    minutas: "/minutas",
  };
  const roleItems = isModerator ? menuItems : menuItems.filter((item) => item.code !== "usuarios").map((item) => ({
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
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a496a] text-white shadow-lg md:hidden"
        aria-label="Abrir menú"
      >
        <IoMenu size={24} />
      </button>
      {mobileOpen && <button type="button" className="fixed inset-0 z-40 bg-slate-950/45 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] shrink-0 flex-col overflow-hidden bg-[#0a496a] p-5 text-white shadow-lg transition-transform md:sticky md:top-5 md:m-5 md:h-[calc(100vh-2.5rem)] md:rounded-[30px] ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div className="mb-3 flex items-center justify-end md:hidden">
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" className="rounded-lg bg-white/10 p-2 text-white">
          <IoClose size={22} />
        </button>
      </div>
      <Link
        href="/lobby"
        aria-label="Ir al lobby para cambiar de privada"
        title="Cambiar de privada"
        className="block rounded-[14px] bg-[#dff1ff] p-4 text-center font-bold text-[#0a496a] transition hover:bg-white hover:shadow-md"
        onClick={() => setMobileOpen(false)}
      >
        COMUNIDAD CONECTADA
      </Link>

      {!isSystemAdmin && activeMembership && <div ref={privateMenuRef} className="relative mt-3">
        <button type="button" onClick={() => setPrivateMenuOpen(v => !v)} className="flex w-full items-center justify-between rounded-xl bg-white/10 p-3 text-left hover:bg-white/15">
          <span className="min-w-0"><span className="block text-[11px] uppercase tracking-wide opacity-70">Privada seleccionada</span><strong className="block truncate">{activeMembership.privada_nombre}</strong></span><IoChevronDown className={`shrink-0 transition ${privateMenuOpen ? "rotate-180" : ""}`}/>
        </button>
        {privateMenuOpen && <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl bg-[#dff1ff] py-2 text-[#0a496a] shadow-xl">
          <Link href="/configuracion-privada" onClick={() => { setPrivateMenuOpen(false); setMobileOpen(false); }} className="flex items-center gap-2 px-4 py-3 font-semibold hover:bg-white"><IoSettingsOutline/> Información y reglamento</Link>
          <button type="button" onClick={() => copyToClipboard(activeMembership.privada_codigo)} className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold hover:bg-white"><IoCopy/> {copiedCode === activeMembership.privada_codigo ? "Código copiado" : "Copiar código"}</button>
          <Link href="/lobby" onClick={() => { setPrivateMenuOpen(false); setMobileOpen(false); }} className="flex items-center gap-2 border-t border-sky-200 px-4 py-3 font-semibold hover:bg-white"><IoSwapHorizontal/> Cambiar de privada</Link>
        </div>}
      </div>}

      <nav className="sidebar-scroll mt-6 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {isSystemAdmin && <Link href="/admin-comunidad" className="mb-3 flex items-center justify-center rounded-xl bg-[#c1e1c1] px-4 py-3 font-semibold text-[#234b31]">Administración global</Link>}
        {visibleMenuItems.map((item) => (
          <Link
            key={item.code}
            href={item.href}
            onClick={() => setMobileOpen(false)}
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

      <div ref={profileMenuRef} className="relative mt-3 shrink-0">
        {profileMenuOpen && <div className="absolute bottom-[58px] right-0 z-30 w-[168px] overflow-hidden rounded-t-xl bg-[#dff1ff] py-2 text-[#0a496a] shadow-xl">
          <Link href="/perfil" onClick={() => { setProfileMenuOpen(false); setMobileOpen(false); }} className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-white/70"><IoCreateOutline className="text-xl" />Editar Perfil</Link>
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
    </>
  );
};

export default Sidebar;
