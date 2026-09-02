"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoClose, IoEye, IoSearch } from "react-icons/io5";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/features/authentication/AuthContext";
import { getCuotaById } from "@/services/cuotas";
import { getPagos, getResumenPagos, validarPago } from "@/services/pagos";
import type { Cuota } from "@/types/cuotas";
import type { EstadoPago, Pago } from "@/types/pagos";

const labels: Record<EstadoPago,string>={pendiente:"Pendiente",en_revision:"En revisión",pagado:"Pagado",atrasado:"Atrasado",no_pagado:"No pagado",declinado:"Declinado"};
const styles: Record<EstadoPago,string>={pendiente:"bg-orange-200",en_revision:"bg-yellow-200",pagado:"bg-green-200",atrasado:"bg-indigo-200",no_pagado:"bg-red-200",declinado:"bg-rose-300"};

export default function DetalleCuotaPage(){
  const { cuotaId }=useParams<{cuotaId:string}>(); const {token}=useAuth();
  const [cuota,setCuota]=useState<Cuota|null>(null); const [pagos,setPagos]=useState<Pago[]>([]); const [selected,setSelected]=useState<Pago|null>(null);
  const [search,setSearch]=useState(""); const [page,setPage]=useState(1); const [count,setCount]=useState(0); const [totals,setTotals]=useState<Record<string,number>>({}); const [motivo,setMotivo]=useState(""); const [error,setError]=useState("");
  const load=async()=>{if(!token)return;try{const filters={cuota:cuotaId,search:search||undefined};const [c,p,r]=await Promise.all([getCuotaById(token,cuotaId),getPagos(token,{...filters,page}),getResumenPagos(token,filters)]);setCuota(c);setPagos(p.results);setCount(p.count);setTotals(r.estados);setError("");}catch(e){setError(e instanceof Error?e.message:"Error al cargar pagos.");}};
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(()=>{void load();},[token,cuotaId,search,page]);
  const review=async(estado:'aceptado'|'declinado')=>{if(!token||!selected)return;try{await validarPago(token,selected.id,estado,motivo);setSelected(null);setMotivo("");await load();}catch(e){setError(e instanceof Error?e.message:"No se pudo validar.");}};
  const exportCsv=()=>{const rows=[["Nombre","Correo","Teléfono","Fecha pago","Estado"],...pagos.map(p=>[p.pagador_detalle.nombre_completo,p.pagador_detalle.email,p.pagador_detalle.telefono,p.fecha_pago||"",labels[p.estado]])];const blob=new Blob([rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`pagos-${cuota?.nombre||cuotaId}.csv`;a.click();URL.revokeObjectURL(a.href);};
  return <div className="flex min-h-screen bg-[#e5eaee]"><Sidebar activeItem="Pagos"/><main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-24 md:pt-6">
    {error&&<p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
    {cuota&&<><p className="mb-4 text-xl text-[#0a496a]">Control de pagos › <b>{cuota.nombre} {cuota.mes}</b></p><section className="mb-5 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-white p-5 shadow"><div><h1 className="text-2xl font-bold text-[#0a496a]">{cuota.nombre}</h1><p>{cuota.descripcion}</p></div><Info label="TIPO DE PAGO" value={cuota.tipo_pago==="mensual"?"Mensual":"Único"}/><Info label="FECHA LÍMITE" value={new Date(`${cuota.fecha_vencimiento}T12:00`).toLocaleDateString("es-MX")}/><Info label="MONTO" value={`$${Number(cuota.monto).toFixed(2)} MXN`}/></section></>}
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-5"><label className="flex w-full max-w-2xl items-center gap-3 rounded-xl bg-white px-5 shadow"><IoSearch/><input className="w-full py-4 outline-none" placeholder="Buscar por nombre o email" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></label><button onClick={exportCsv} className="rounded-xl bg-[#0a496a] px-6 font-bold text-white">Exportar reporte</button></div>
    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{(['atrasado','pagado','en_revision','pendiente','no_pagado','declinado'] as EstadoPago[]).map(s=><div key={s} className={`rounded-lg p-4 text-center ${styles[s]}`}><b>{totals[s]||0}</b> {labels[s]}</div>)}</div>
    <div className="overflow-hidden rounded-2xl bg-white shadow"><div className="overflow-x-auto"><table className="w-full min-w-[820px]"><thead className="bg-[#0a496a] text-white"><tr>{["Nombre completo","Correo electrónico","Núm Tel","Fecha de pago","Estado","Recibo"].map(h=><th key={h} className="p-4 text-left">{h}</th>)}</tr></thead><tbody>{pagos.map(p=><tr key={p.id} className="border-b even:bg-slate-50"><td className="p-4">{p.pagador_detalle.nombre_completo}</td><td>{p.pagador_detalle.email}</td><td>{p.pagador_detalle.telefono||"-"}</td><td>{p.fecha_pago?new Date(p.fecha_pago).toLocaleDateString("es-MX"):"-"}</td><td><span className={`rounded-lg px-3 py-2 ${styles[p.estado]}`}>{labels[p.estado]}</span></td><td><button disabled={!p.comprobante_url} onClick={()=>setSelected(p)} className="p-3 text-[#0a496a] disabled:opacity-25"><IoEye size={24}/></button></td></tr>)}</tbody></table></div><Pagination currentPage={page} totalPages={Math.max(1,Math.ceil(count/20))} onPageChange={setPage}/></div>
  </main>{selected&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5"><div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7"><div className="flex justify-between"><h2 className="text-2xl font-bold text-[#0a496a]">Comprobante de {selected.pagador_detalle.nombre_completo}</h2><button onClick={()=>setSelected(null)}><IoClose size={30}/></button></div><img src={selected.comprobante_url} alt="Comprobante" className="my-5 max-h-[55vh] w-full rounded-xl object-contain"/><div className="mb-4 space-y-2">{selected.intentos.map(i=><div key={i.id} className="rounded bg-slate-100 p-3 text-sm">{new Date(i.enviado_en).toLocaleString("es-MX")} · {i.estado}{i.motivo_declinado&&` · ${i.motivo_declinado}`}</div>)}</div>{selected.estado==="en_revision"&&<><textarea value={motivo} onChange={e=>setMotivo(e.target.value)} placeholder="Motivo requerido al declinar" className="mb-4 w-full rounded-xl border p-3"/><div className="grid grid-cols-2 gap-4"><button onClick={()=>void review('declinado')} className="rounded-xl bg-red-600 p-3 font-bold text-white">Declinar</button><button onClick={()=>void review('aceptado')} className="rounded-xl bg-green-600 p-3 font-bold text-white">Aceptar pago</button></div></>}</div></div>}</div>;
}
function Info({label,value}:{label:string;value:string}){return <div className="border-l px-5 text-right"><p className="font-bold text-gray-500">{label}</p><p className="text-2xl font-bold text-[#0a496a]">{value}</p></div>}
