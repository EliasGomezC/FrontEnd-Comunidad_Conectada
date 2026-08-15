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
  return <div className="flex min-h-screen bg-[#dfe5eb]"><Sidebar activeItem={activeItem}/><main className="min-w-0 flex-1 p-8">{children}</main></div>;
}

export function ModuleHeader({ title, subtitle, search, onSearch, action }: { title:string; subtitle:string; search:string; onSearch:(value:string)=>void; action?:React.ReactNode }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-5xl font-bold text-[#0a496a]">{title}</h1><p className="mt-1 text-lg text-[#295c7f]">{subtitle}</p><input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Buscar..." className="mt-4 w-full max-w-xl rounded-xl border-0 bg-white px-5 py-4 shadow outline-none"/></div>{action}</div>;
}

export function EmptyState({ loading, error, empty }: {loading:boolean;error:string;empty:boolean}) {
  if (loading) return <p className="py-20 text-center text-xl text-[#0a496a]">Cargando...</p>;
  if (error) return <p className="rounded-xl bg-red-100 p-4 text-red-700">{error}</p>;
  if (empty) return <p className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">No hay información para mostrar.</p>;
  return null;
}
