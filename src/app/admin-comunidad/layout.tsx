"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/authentication/AuthContext";

export default function AdminComunidadLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, isSystemAdmin, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && !isSystemAdmin) router.replace("/lobby");
  }, [isAuthenticated, isLoading, isSystemAdmin, router]);

  if (isLoading || !isAuthenticated || !isSystemAdmin) return <div className="min-h-screen grid place-items-center">Cargando...</div>;
  return <div>{children}<button onClick={logout} className="fixed right-6 top-6 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">Cerrar sesión</button></div>;
}
