"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/authentication/AuthContext";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#dfe5eb] flex items-center justify-center">
      <div className="text-[#0a496a] text-xl">Cargando...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
