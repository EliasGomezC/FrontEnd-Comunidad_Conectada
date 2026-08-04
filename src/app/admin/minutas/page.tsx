"use client";
import Sidebar from "@/components/Sidebar";
import MinutasModule from "@/components/MinutasModule";

export default function AdminMinutasPage(){return <div className="flex min-h-screen bg-[#dfe5eb]"><Sidebar activeItem="Minutas"/><main className="min-w-0 flex-1 p-8"><MinutasModule moderator/></main></div>}
