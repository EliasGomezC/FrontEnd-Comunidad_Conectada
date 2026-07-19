import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import {
  IoShield, IoLeaf, IoConstructOutline, IoBulb, IoCutOutline,
  IoSparkles, IoCar, IoCamera, IoFlame,
  IoEyeOutline, IoPencilOutline, IoTrashOutline
} from "react-icons/io5";

interface Contact {
  id: number;
  name: string;
  category: string;
  phone: string;
  schedule: string;
  emoji: string;
}

const contacts: Contact[] = [
  { id: 1, name: "Policía", category: "Seguridad", phone: "911", schedule: "Servicio de Policía 24/7", emoji: "🚓" },
  { id: 2, name: "Jardín Orión", category: "Servicios", phone: "664 616 0702", schedule: "Lunes a Viernes 10am - 5pm", emoji: "🌳" },
  { id: 3, name: "Plomería García", category: "Mantenimiento", phone: "664 555 0123", schedule: "Lunes a Domingo", emoji: "🔧" },
  { id: 4, name: "Electricidad Ariel", category: "Servicios", phone: "664 338 5545", schedule: "Instalaciones eléctricas", emoji: "💡" },
  { id: 5, name: "Corte Cabello", category: "Local", phone: "664 235 7636", schedule: "Casa #15", emoji: "💈" },
  { id: 6, name: "Servicio Limpieza", category: "Servicios", phone: "663 215 9161", schedule: "Lunes a Sábado", emoji: "🧹" },
  { id: 7, name: "Agua Potable", category: "Servicios", phone: "664 135 2020", schedule: "8am - 7pm", emoji: "🚛" },
  { id: 8, name: "Security Cam", category: "Seguridad", phone: "664 278 7804", schedule: "Cámaras y alarmas", emoji: "📷" },
  { id: 9, name: "Gas", category: "Servicios", phone: "664 169 3254", schedule: "9am - 8pm", emoji: "⛽" },
];

const emojiToIcon: Record<string, React.ReactNode> = {
  "🚓": <IoCar size={50} color="#12486d" />,
  "🌳": <IoLeaf size={50} color="#12486d" />,
  "🔧": <IoConstructOutline size={50} color="#12486d" />,
  "💡": <IoBulb size={50} color="#12486d" />,
  "💈": <IoCutOutline size={50} color="#12486d" />,
  "🧹": <IoSparkles size={50} color="#12486d" />,
  "🚛": <IoCar size={50} color="#12486d" />,
  "📷": <IoCamera size={50} color="#12486d" />,
  "⛽": <IoFlame size={50} color="#12486d" />,
};

const DirectorioPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-[#dde3ea]">
      <Sidebar activeItem="Directorio" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-center gap-5 flex-wrap mb-8">
          <div>
            <h1 className="text-[52px] m-0 mb-5 text-[#12486d]">Directorio Virtual</h1>
            <SearchBar placeholder="Buscar contacto..." className="w-[500px] max-w-full" />
          </div>
          <button className="bg-[#0a496a] text-white border-none px-[26px] py-[18px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80]">
            + Añadir Contacto
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 mt-8">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-[20px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <h2 className="m-0 text-xl text-slate-900">{contact.name}</h2>
                  <span className="inline-block p-1 px-2 rounded-[8px] bg-[#c8f0bf] text-[#215d2d] text-sm mt-2">
                    {contact.category}
                  </span>
                  <p className="mt-2"><strong>Tel:</strong> {contact.phone}</p>
                  <small className="text-slate-900">{contact.schedule}</small>
                </div>
                <div className="w-[150px] h-[130px] rounded-[14px] bg-[#d9e7f3] flex items-center justify-center">
                  {emojiToIcon[contact.emoji]}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="flex items-center gap-1 px-[14px] py-[9px] border-none rounded-[8px] font-bold cursor-pointer bg-[#0a496a] text-white hover:bg-[#0d5a80]">
                  <IoEyeOutline size={18} /> Mostrar
                </button>
                <button className="flex items-center gap-1 px-[14px] py-[9px] border-none rounded-[8px] font-bold cursor-pointer bg-[#ffd58d] hover:bg-[#ffcc70]">
                  <IoPencilOutline size={18} /> Editar
                </button>
                <button className="flex items-center gap-1 px-[14px] py-[9px] border-none rounded-[8px] font-bold cursor-pointer bg-[#ffb9b9] hover:bg-[#ffa3a3]">
                  <IoTrashOutline size={18} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DirectorioPage;
