"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/authentication/AuthContext";
import { getPagos } from "@/services/pagos";
import { Pago } from "@/types/pagos";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import PaymentCard from "@/components/PaymentCard";
import { IoReload } from "react-icons/io5";

const iconMap = {
  cleaning: "cleaning",
  security: "security",
  garden: "garden",
  event: "event",
} as const;

const colorMap = {
  orange: "orange",
  blue: "blue",
  green: "green",
  purple: "purple",
} as const;

const PagosPage = () => {
  const { token, logout } = useAuth();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchPagos = async () => {
      try {
        setIsLoading(true);
        const data = await getPagos(token);
        setPagos(data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar pagos");
        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPagos();
  }, [token, logout]);

  const filteredPagos = useMemo(() => {
    if (!searchTerm) return pagos;
    const term = searchTerm.toLowerCase();
    return pagos.filter((pago) =>
      pago.notas?.toLowerCase().includes(term) ||
      pago.metodo_pago?.toLowerCase().includes(term)
    );
  }, [pagos, searchTerm]);

  const mapPagoToPaymentCard = (pago: Pago) => {
    const icons = ["cleaning", "security", "garden", "event"] as const;
    const colors = ["orange", "blue", "green", "purple"] as const;
    const iconIndex = Math.abs(pago.id) % icons.length;
    const colorIndex = Math.abs(pago.id) % colors.length;

    return {
      id: pago.id,
      title: `Pago #${pago.id}`,
      description: pago.notas || "Pago de cuota",
      month: new Date(pago.fecha_pago).toLocaleDateString("es-ES", { month: "long" }).toUpperCase(),
      paymentType: "Mensual" as const,
      dueDate: new Date(pago.fecha_pago).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      amount: pago.monto,
      icon: icons[iconIndex],
      color: colors[colorIndex],
    };
  };

  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Pagos" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-start gap-5 flex-wrap mb-8">
          <div>
            <h1 className="m-0 text-[52px] text-[#124b70]">Control de Pagos</h1>
            <p className="m-0 text-[18px] text-[#124b70]">Administración de pagos por servicio o concepto.</p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar 
              placeholder="Buscar" 
              className="w-[360px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-[#0a496a] text-white border-none px-[22px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80] whitespace-nowrap">
              ＋ Nuevo pago
            </button>
            <button className="w-[50px] h-[50px] rounded-[14px] border-none bg-white flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-gray-50">
              <IoReload size={22} color="#12486d" />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#0a496a] text-xl">Cargando pagos...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPagos.map((pago) => (
              <PaymentCard key={pago.id} payment={mapPagoToPaymentCard(pago)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PagosPage;
