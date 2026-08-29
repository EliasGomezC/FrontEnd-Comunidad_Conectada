"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoClose, IoCloudUpload, IoEye, IoSearch } from "react-icons/io5";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/features/authentication/AuthContext";
import { getPagos, getResumenPagos, subirComprobante } from "@/services/pagos";
import type { EstadoPago, Pago } from "@/types/pagos";

const labels:Record<EstadoPago,string>={pendiente:"Pendiente",en_revision:"En revisión",pagado:"Pagado",atrasado:"Atrasado",no_pagado:"No pagado",declinado:"Declinado"};
const styles:Record<EstadoPago,string>={pendiente:"bg-orange-200",en_revision:"bg-yellow-200",pagado:"bg-green-200",atrasado:"bg-indigo-200",no_pagado:"bg-red-200",declinado:"bg-rose-300"};
const canUpload=(s:EstadoPago)=>['pendiente','no_pagado','declinado'].includes(s);

export default function PagosHabitantePage(){
 const {token,isAuthenticated,isLoading,activeMembership}=useAuth();const router=useRouter();const params=useSearchParams();
 const [pagos,setPagos]=useState<Pago[]>([]);const [count,setCount]=useState(0);const [totals,setTotals]=useState<Record<string,number>>({});const [page,setPage]=useState(1);const [search,setSearch]=useState("");const [selected,setSelected]=useState<Pago|null>(null);const [file,setFile]=useState<File|null>(null);const [saving,setSaving]=useState(false);const [error,setError]=useState("");
 const load=async()=>{if(!token||!activeMembership)return;try{const filters={privada:activeMembership.privada,cuota:params.get('cuota')||undefined,search:search||undefined};const [data,resumen]=await Promise.all([getPagos(token,{...filters,page}),getResumenPagos(token,filters)]);setPagos(data.results);setCount(data.count);setTotals(resumen.estados);setError("");}catch(e){setError(e instanceof Error?e.message:"No se pudieron cargar los pagos.");}};
 useEffect(()=>{if(!isLoading&&!isAuthenticated)router.replace('/login?redirect=/pagos');},[isAuthenticated,isLoading,router]);
 useEffect(()=>{if(!isLoading&&isAuthenticated&&!activeMembership)router.replace('/lobby');},[activeMembership,isAuthenticated,isLoading,router]);
 // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
 useEffect(()=>{void load();},[token,activeMembership,search,page,params]);
 const upload=async()=>{if(!token||!selected||!file)return;setSaving(true);try{await subirComprobante(token,selected.id,file);setSelected(null);setFile(null);await load();}catch(e){setError(e instanceof Error?e.message:"No se pudo subir el comprobante.");}finally{setSaving(false)}};
 if(isLoading||!isAuthenticated)return <div className="min-h-screen bg-[#dfe5eb] p-20 text-center text-[#0a496a]">Cargando...</div>;
 return <div className="flex min-h-screen bg-[#e5eaee]"><Sidebar activeItem="Pagos"/><main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-24 md:pt-6"><h1 className="text-3xl font-bold text-[#0a496a] sm:text-4xl md:text-5xl">Control de Pagos</h1><p className="mb-7 text-lg text-[#295c7f]">Tus cuotas y comprobantes de pago</p>
 {error&&<p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
 <label className="mb-4 flex max-w-2xl items-center gap-3 rounded-xl bg-white px-5 shadow"><IoSearch/><input className="w-full py-4 outline-none" placeholder="Buscar por nombre del pago" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></label>
 <div className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-6">{(['atrasado','pagado','en_revision','pendiente','no_pagado','declinado'] as EstadoPago[]).map(s=><div key={s} className={`rounded-lg p-4 text-center ${styles[s]}`}><b>{totals[s]||0}</b> {labels[s]}</div>)}</div>
 <div className="overflow-hidden rounded-2xl bg-white shadow"><div className="overflow-x-auto"><table className="w-full min-w-[720px]"><thead className="bg-[#0a496a] text-white"><tr>{["Nombre del pago","Tipo de pago","Fecha límite","Fecha de pago","Estado","Recibos"].map(h=><th key={h} className="p-4 text-left">{h}</th>)}</tr></thead><tbody>{pagos.map(p=><tr key={p.id} className="border-b even:bg-slate-50"><td className="p-4">{p.cuota_detalle.nombre}</td><td className="capitalize">{p.cuota_detalle.tipo_pago}{p.cuota_detalle.tipo_pago==='mensual'&&` (${p.cuota_detalle.mes})`}</td><td>{new Date(`${p.cuota_detalle.fecha_vencimiento}T12:00`).toLocaleDateString('es-MX')}</td><td>{p.fecha_pago?new Date(p.fecha_pago).toLocaleDateString('es-MX'):'-'}</td><td><span className={`rounded-lg px-3 py-2 ${styles[p.estado]}`}>{labels[p.estado]}</span></td><td>{canUpload(p.estado)?<button onClick={()=>setSelected(p)} title="Subir comprobante" className="p-2 text-[#0a496a]"><IoCloudUpload size={25}/></button>:<button disabled={!p.comprobante_url} onClick={()=>setSelected(p)} className="p-2 text-[#0a496a] disabled:opacity-25"><IoEye size={25}/></button>}</td></tr>)}</tbody></table></div><Pagination currentPage={page} totalPages={Math.max(1,Math.ceil(count/20))} onPageChange={setPage}/></div>
 </main>{selected&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5"><div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-7"><div className="flex justify-between"><h2 className="text-2xl font-bold text-[#0a496a]">{canUpload(selected.estado)?'Enviar comprobante':'Comprobante'}</h2><button onClick={()=>{setSelected(null);setFile(null)}}><IoClose size={30}/></button></div><div className="my-4 rounded-xl bg-blue-50 p-4"><b>{selected.cuota_detalle.nombre}</b><p>Monto: ${Number(selected.cuota_detalle.monto).toFixed(2)} MXN</p><p>Cuenta: {selected.cuota_detalle.cuenta}</p></div>{canUpload(selected.estado)?<><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)} className="w-full rounded-xl border p-4"/><p className="my-3 text-sm text-gray-500">JPG, PNG o WEBP. Máximo 8 MB.</p><button disabled={!file||saving} onClick={()=>void upload()} className="w-full rounded-xl bg-[#0a496a] p-4 font-bold text-white disabled:opacity-50">{saving?'Subiendo...':'Enviar a revisión'}</button></>:<img src={selected.comprobante_url} alt="Comprobante" className="max-h-[50vh] w-full rounded-xl object-contain"/>}</div></div>}</div>;
}
