"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/features/authentication/AuthContext";

export default function HabitantePage({ activeItem, children }: { activeItem: string; children: React.ReactNode }) {
  const { isAuthenticated, isLoading, activeMembership } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    else if (!isLoading && !activeMembership) router.replace("/lobby");
  }, [activeMembership, isAuthenticated, isLoading, router]);
  if (isLoading || !isAuthenticated || !activeMembership) return <div className="grid min-h-screen place-items-center bg-[#dfe5eb] text-xl text-[#0a496a]">Cargando...</div>;
  return <div className="flex min-h-screen bg-[#dfe5eb]"><Sidebar activeItem={activeItem}/><main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-24 md:pt-6">{children}</main></div>;
}

export function ModuleHeader({ title, subtitle, search, onSearch, action }: { title:string; subtitle:string; search:string; onSearch:(value:string)=>void; action?:React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-end md:gap-5">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-[#0a496a] sm:text-4xl md:text-5xl">{title}</h1>
        <p className="mt-1 text-base text-[#295c7f] md:text-lg">{subtitle}</p>
        <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Buscar..." className="mt-4 w-full max-w-xl rounded-xl border-0 bg-white px-5 py-4 shadow outline-none"/>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({ loading, error, empty }: {loading:boolean;error:string;empty:boolean}) {
  if (loading) return <p className="py-20 text-center text-xl text-[#0a496a]">Cargando...</p>;
  if (error) return <p className="rounded-xl bg-red-100 p-4 text-red-700">{error}</p>;
  if (empty) return <p className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">No hay información para mostrar.</p>;
  return null;
}
