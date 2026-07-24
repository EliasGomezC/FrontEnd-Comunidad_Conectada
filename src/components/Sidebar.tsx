"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  IoBook,
  IoCalendarClear,
  IoCash,
  IoChevronBack,
  IoChevronForward,
  IoCreateOutline,
  IoCube,
  IoDocuments,
  IoDocumentText,
  IoLogOutOutline,
  IoPeople,
} from "react-icons/io5";

interface SidebarProps {
  activeItem?: string;
  userName?: string;
  userRole?: string;
  userImage?: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Usuarios",
    icon: <IoPeople />,
    href: "/admin/usuarios",
  },
  {
    label: "Reportes",
    icon: <IoDocumentText />,
    href: "/admin/reportes",
  },
  {
    label: "Reservaciones",
    icon: <IoBook />,
    href: "/admin/reservaciones",
  },
  {
    label: "Directorio",
    icon: <IoDocuments />,
    href: "/admin/directorio",
  },
  {
    label: "Eventos y proyectos",
    icon: <IoCalendarClear />,
    href: "/admin/eventos",
  },
  {
    label: "Objetos perdidos",
    icon: <IoCube />,
    href: "/admin/objetos-perdidos",
  },
  {
    label: "Pagos",
    icon: <IoCash />,
    href: "/admin/pagos",
  },
];

const Sidebar = ({
  activeItem,
  userName = "Usuario321",
  userRole = "Moderador",
  userImage = "/assets/img/avatarUsuario.png",
}: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedState = localStorage.getItem(
      "comunidad-conectada-sidebar-collapsed"
    );

    setIsCollapsed(savedState === "true");
    setSidebarReady(true);
  }, []);

  const isActive = (href: string, label: string) => {
    if (activeItem) {
      return activeItem.toLowerCase() === label.toLowerCase();
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("comunidad-conectada-auth");
    localStorage.removeItem(
      "comunidad-conectada-sidebar-collapsed"
    );

    router.replace("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed((previousState) => {
      const newState = !previousState;

      localStorage.setItem(
        "comunidad-conectada-sidebar-collapsed",
        String(newState)
      );

      return newState;
    });

    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!sidebarReady) {
    return (
      <aside
        className="
          sticky top-4 z-40
          my-4 ml-4
          h-[calc(100vh-32px)]
          w-[108px] min-w-[108px]
          shrink-0 rounded-[48px]
          bg-[#075273]
        "
        aria-busy="true"
      />
    );
  }

  return (
    <aside
      className={`
        sticky top-4 z-40
        my-4 ml-4
        flex h-[calc(100vh-32px)]
        shrink-0 flex-col
        overflow-visible
        rounded-[48px]
        bg-[#075273]
        font-satoshi
        text-white
        shadow-md
        transition-[width] duration-300 ease-in-out
        ${
          isCollapsed
            ? "w-[108px] min-w-[108px]"
            : "w-[305px] min-w-[305px]"
        }
      `}
    >
      {/* Encabezado */}
      <div
        className={`
          flex shrink-0 items-center
          ${
            isCollapsed
              ? "justify-center px-4 pt-6"
              : "gap-4 px-6 pt-6"
          }
        `}
      >
        {/* Logo */}
        <div
          className={`
            flex items-center justify-center
            overflow-hidden rounded-[14px]
            bg-[#c8e7fb]
            transition-all duration-300
            ${
              isCollapsed
                ? "h-[65px] w-[65px]"
                : "h-[63px] min-w-0 flex-1 px-3"
            }
          `}
        >
          <Image
            src="/assets/img/logoComunidadConectada.png"
            alt="Comunidad Conectada"
            width={190}
            height={70}
            priority
            className={`
              object-contain transition-all duration-300
              ${
                isCollapsed
                  ? "h-[54px] w-[54px] object-cover object-left"
                  : "h-auto max-h-[53px] w-full"
              }
            `}
          />
        </div>

        {/* Botón para contraer */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            isCollapsed ? "Expandir sidebar" : "Contraer sidebar"
          }
          className={`
            flex h-[63px] w-[54px] shrink-0
            items-center justify-center
            rounded-[14px]
            bg-[#c8e7fb]
            text-[#075273]
            transition-all duration-200
            hover:bg-[#b0dcf8]
            active:scale-95
            ${
              isCollapsed
                ? "absolute left-[94px] top-[28px]"
                : ""
            }
          `}
        >
          {isCollapsed ? (
            <IoChevronForward className="h-8 w-8" />
          ) : (
            <IoChevronBack className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Navegación */}
      <nav
        className={`
          mt-7 flex min-h-0 flex-1 flex-col
          overflow-y-auto overflow-x-hidden
          sidebar-scrollbar
          ${isCollapsed ? "items-center px-4" : "px-6"}
        `}
      >
        <div className="flex w-full flex-col gap-2">
          {menuItems.map((item) => {
            const active = isActive(item.href, item.label);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`
                  group flex shrink-0 items-center
                  rounded-[14px]
                  no-underline
                  transition-all duration-200
                  ${
                    isCollapsed
                      ? "mx-auto h-[74px] w-[65px] justify-center"
                      : "min-h-[0px] w-full gap-4 px-4 py-3"
                  }
                  ${
                    active
                      ? "bg-[#bfe0f6] text-[#075273]"
                      : "text-white hover:bg-[#bfe0f6] hover:text-[#075273]"
                  }
                `}
              >
                <span
                  className={`
                    flex shrink-0 items-center justify-center
                    text-[26px]
                    transition-transform duration-200
                    group-hover:scale-105
                    ${isCollapsed ? "h-11 w-11" : "h-11 w-11"}
                  `}
                >
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span
                    className="
                      min-w-0 text-[18px]
                      font-bold leading-[1.05]
                    "
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Perfil */}
      <div
        ref={profileRef}
        className={`
          relative shrink-0
          ${isCollapsed ? "px-3 pb-4" : "px-5 pb-5"}
        `}
      >
        {/* Menú desplegable del perfil */}
        {isProfileMenuOpen && (
          <div
            className={`
              absolute z-50
              overflow-hidden
              rounded-t-[14px]
              bg-[#dff1fc]
              text-[#075273]
              shadow-xl
              ${
                isCollapsed
                  ? "bottom-[87px] left-[106px] w-[168px] rounded-[14px]"
                  : "bottom-[80px] right-[19px] w-[168px]"
              }
            `}
          >
            <Link
              href="/admin/perfil"
              onClick={() => setIsProfileMenuOpen(false)}
              className="
                flex min-h-[58px] items-center gap-3
                px-4 py-3
                text-[15px] font-bold
                no-underline
                transition-colors
                hover:bg-[#c8e7fb]
              "
            >
              <IoCreateOutline className="h-5 w-5 shrink-0" />
              Editar perfil
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex min-h-[58px] w-full items-center gap-3
                px-4 py-3 text-left
                text-[15px] font-bold
                transition-colors
                hover:bg-[#c8e7fb]
              "
            >
              <IoLogOutOutline className="h-5 w-5 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            setIsProfileMenuOpen((previousState) => !previousState)
          }
          aria-expanded={isProfileMenuOpen}
          className={`
            flex w-full items-center
            bg-[#dff1fc]
            text-left text-[#075273]
            transition-all duration-200
            hover:bg-[#cfeafa]
            ${
              isCollapsed
                ? "h-[77px] justify-center rounded-full p-1.5"
                : "min-h-[72px] gap-3 rounded-full px-4 py-2"
            }
          `}
        >
          {/* Imagen del usuario */}
          <div
            className="
              flex h-[60px] w-[60px] shrink-0
              items-center justify-center
              overflow-hidden rounded-full
              border-[3px] border-[#075273]
              bg-white
            "
          >
            <Image
              src={userImage}
              alt={`Foto de ${userName}`}
              width={60}
              height={60}
              className="h-full w-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-[16px] font-black leading-tight">
                {userName}
              </p>

              <p className="truncate text-[14px] font-medium leading-tight">
                {userRole}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;