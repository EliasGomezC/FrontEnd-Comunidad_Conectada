"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoAdd, IoClose, IoSearch } from "react-icons/io5";
import Sidebar from "@/components/Sidebar";
import PaymentCard from "@/components/PaymentCard";
import Pagination from "@/components/Pagination";
import { useAuth } from "@/features/authentication/AuthContext";
import { crearCuota, getCuotas } from "@/services/cuotas";
import type { CrearCuotaRequest, Cuota } from "@/types/cuotas";

const initialForm: Omit<CrearCuotaRequest, "privada"> = { nombre: "", tipo_pago: "mensual", descripcion: "", fecha_vencimiento: "", monto: "", cuenta: "", categoria: "limpieza", icono: "cleaning", color_icono: "orange" };

export default function PagosModeradorPage() {
  const { token, activeMembership } = useAuth();
  const router = useRouter();
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const privada = activeMembership?.rol === "moderador" ? activeMembership.privada : undefined;

  const load = async () => {
    if (!token || !privada) return;
    setLoading(true);
    try {
      const data = await getCuotas(token, { privada, search: search || undefined, page });
      setCuotas(data.results); setCount(data.count); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudieron cargar las cuotas."); }
    finally { setLoading(false); }
  };
  // La carga sincroniza la pantalla con la API al cambiar filtros.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [token, privada, search, page]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !privada) return;
    setSaving(true); setError("");
    try {
      await crearCuota(token, { ...form, privada });
      setOpen(false); setForm(initialForm); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo crear la cuota."); }
    finally { setSaving(false); }
  };

  return <div className="flex min-h-screen bg-[#dfe5eb]">
    <Sidebar activeItem="Pagos" />
    <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-24 lg:pt-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-end md:gap-5">
        <div className="min-w-0"><h1 className="text-3xl font-bold text-[#0a496a] sm:text-4xl md:text-5xl">Control de Pagos</h1><p className="text-lg text-[#295c7f] md:text-xl">Administración de pagos por servicio o concepto</p></div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:flex-1 md:justify-end md:gap-5">
          <label className="flex w-full max-w-xl items-center gap-3 rounded-xl bg-white px-5 shadow"><IoSearch className="text-3xl text-[#0a496a]"/><input value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Buscar" className="w-full py-4 outline-none" /></label>
          <button type="button" onClick={()=>setOpen(true)} className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0a496a] px-6 py-4 font-bold text-white"><IoAdd size={28}/> Nuevo pago</button>
        </div>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}
      {loading ? <p className="py-20 text-center text-xl text-[#0a496a]">Cargando cuotas...</p> :
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{cuotas.map((cuota)=><PaymentCard key={cuota.id} cuota={cuota} onView={()=>router.push(`/admin/pagos/${cuota.id}`)} onCopy={async()=>navigator.clipboard.writeText(`${window.location.origin}/pagos?cuota=${cuota.id}`)} />)}</div>}
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(count/20))} onPageChange={setPage}/>
    </main>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <form onSubmit={submit} className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[30px] bg-[#f7f8fb] p-10 shadow-2xl">
        <div className="flex justify-between"><div><h2 className="text-3xl font-bold text-[#0a496a]">Nuevo Pago</h2><p className="text-gray-500">Crea una cuota para todos los habitantes de la privada.</p></div><button type="button" onClick={()=>setOpen(false)}><IoClose size={32}/></button></div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Field label="Nombre del pago"><input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Nombre" /></Field>
          <Field label="Tipo de pago"><select value={form.tipo_pago} onChange={e=>setForm({...form,tipo_pago:e.target.value as CrearCuotaRequest['tipo_pago']})}><option value="mensual">Mensual</option><option value="unico">Único</option></select></Field>
          <Field label="Descripción del pago" wide><textarea required maxLength={100} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} placeholder="Detalles sobre el pago..." /></Field>
          <Field label="Fecha límite de pago"><input required type="date" value={form.fecha_vencimiento} onChange={e=>setForm({...form,fecha_vencimiento:e.target.value})}/></Field>
          <Field label="Monto a pagar"><input required min="0.01" step="0.01" type="number" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} placeholder="MXN"/></Field>
          <Field label="Cuenta de depósito" wide><input required value={form.cuenta} onChange={e=>setForm({...form,cuenta:e.target.value})} placeholder="CLABE, cuenta o instrucciones de depósito"/></Field>
          <Field label="Icono"><select value={form.icono} onChange={e=>setForm({...form,icono:e.target.value,categoria:e.target.value})}><option value="cleaning">Limpieza</option><option value="security">Seguridad</option><option value="garden">Jardinería</option><option value="event">Evento</option></select></Field>
          <Field label="Color del icono"><select value={form.color_icono} onChange={e=>setForm({...form,color_icono:e.target.value})}><option value="orange">Naranja</option><option value="blue">Azul</option><option value="green">Verde</option><option value="purple">Morado</option></select></Field>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5"><button type="button" onClick={()=>setOpen(false)} className="rounded-xl border-2 border-[#0a496a] py-4 font-bold text-[#0a496a]">Cancelar</button><button disabled={saving} className="rounded-xl bg-[#0a496a] py-4 font-bold text-white disabled:opacity-60">{saving?"Creando...":"Crear Pago"}</button></div>
      </form>
    </div>}
  </div>;
}

function Field({label,wide=false,children}:{label:string;wide?:boolean;children:React.ReactNode}) { return <label className={`flex flex-col gap-2 font-semibold text-gray-700 ${wide?"md:col-span-2":""}`}>{label}<div className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-200 [&_input]:bg-white [&_input]:p-4 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-gray-200 [&_select]:bg-white [&_select]:p-4 [&_textarea]:min-h-28 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-gray-200 [&_textarea]:bg-white [&_textarea]:p-4">{children}</div></label>; }
