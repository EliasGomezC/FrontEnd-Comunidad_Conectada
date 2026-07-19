import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { IoReload } from "react-icons/io5";
import { payments } from "./payments";
import PaymentCard from "@/components/PaymentCard";

const PagosPage: NextPage = () => {
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
            <SearchBar placeholder="Buscar" className="w-[360px]" />
            <button className="bg-[#0a496a] text-white border-none px-[22px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80] whitespace-nowrap">
              ＋ Nuevo pago
            </button>
            <button className="w-[50px] h-[50px] rounded-[14px] border-none bg-white flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-gray-50">
              <IoReload size={22} color="#12486d" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PagosPage;
