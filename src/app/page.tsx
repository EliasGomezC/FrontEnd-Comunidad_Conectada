"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/authentication/AuthContext";

export default function Home() {
  const { isAuthenticated, isModerator, isSystemAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? (isSystemAdmin ? "/admin-comunidad" : isModerator ? "/admin/usuarios" : "/lobby") : "/login");
  }, [isAuthenticated, isModerator, isSystemAdmin, isLoading, router]);

  return <div className="min-h-screen grid place-items-center text-[#0a496a]">Cargando...</div>;
}
