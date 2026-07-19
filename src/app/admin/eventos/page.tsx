import type { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import {
  IoFootball, IoLeaf, IoImageOutline, IoReload,
  IoCalendarOutline, IoLocationOutline, IoPeopleOutline
} from "react-icons/io5";

interface Event {
  id: number;
  title: string;
  tag: string;
  tagColor: string;
  date: string;
  location: string;
  attendees: number;
  emoji: string;
}

const emojiToIcon: Record<string, React.ReactNode> = {
  "⚽": <IoFootball size={50} color="#12486d" />,
  "🌳": <IoLeaf size={50} color="#12486d" />,
  "🖼️": <IoImageOutline size={50} color="#12486d" />,
  "♻️": <IoReload size={50} color="#12486d" />,
};

const events: Event[] = [
  { id: 1, title: "Torneo Fútbol", tag: "Deportes", tagColor: "#e6a23c", date: "28 de Enero, 2026 • 14:00", location: "Área Común - Zona Norte", attendees: 28, emoji: "⚽" },
  { id: 2, title: "Renovación de Jardín", tag: "Proyecto", tagColor: "#ef4444", date: "28 de Enero, 2026 • 14:00", location: "Área Común - Zona Norte", attendees: 28, emoji: "🌳" },
  { id: 3, title: "Asamblea General", tag: "Asamblea", tagColor: "#0f4c75", date: "28 de Enero, 2026 • 14:00", location: "Área Común - Zona Norte", attendees: 28, emoji: "🖼️" },
  { id: 4, title: "Día de Reciclaje", tag: "Sostenibilidad", tagColor: "#6aa84f", date: "28 de Enero, 2026 • 14:00", location: "Área Común - Zona Norte", attendees: 28, emoji: "♻️" },
];

const EventosPage: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-[#dfe5eb]">
      <Sidebar activeItem="Eventos" />

      <main className="flex-1 p-[30px]">
        <div className="flex justify-between items-start gap-5 flex-wrap mb-8">
          <div>
            <h1 className="m-0 text-[52px] text-[#124b70]">Eventos y Proyectos</h1>
            <p className="m-0 text-[22px] text-[#124b70]">Gestiona las actividades próximas de la comunidad.</p>
            <SearchBar placeholder="Buscar eventos o proyectos..." className="w-[600px] max-w-full mt-3" />
          </div>
          <button className="bg-[#0a496a] text-white border-none px-[26px] py-[18px] rounded-[14px] cursor-pointer hover:bg-[#0d5a80] text-lg">
            ＋ Agregar Evento
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(470px,1fr))] gap-7 mt-9">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[22px] p-5 relative shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
            >
              <span
                className="absolute right-[18px] top-[-14px] text-white p-1 px-4 rounded-[8px] font-bold text-sm"
                style={{ backgroundColor: event.tagColor }}
              >
                {event.tag}
              </span>
              <div className="flex gap-5">
                <div className="flex-1">
                  <h2 className="text-xl m-0 text-slate-900">{event.title}</h2>
                  <p className="m-1 flex items-center gap-1 text-slate-900"><IoCalendarOutline size={18} /> {event.date}</p>
                  <p className="m-1 flex items-center gap-1 text-slate-900"><IoLocationOutline size={18} /> {event.location}</p>
                  <p className="m-1 flex items-center gap-1 text-slate-900"><IoPeopleOutline size={18} /> {event.attendees} personas asistirán</p>
                  <a
                    href="#"
                    className="mt-5 bg-[#0a496a] text-white px-[20px] py-[14px] rounded-[10px] inline-block no-underline hover:bg-[#0d5a80]"
                  >
                    Gestionar Evento →
                  </a>
                </div>
                <div className="w-[300px] h-[220px] bg-[#d7e9f5] rounded-[12px] flex items-center justify-center text-[80px]">
                  {emojiToIcon[event.emoji]}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination currentPage={1} totalPages={10} />
      </main>
    </div>
  );
};

export default EventosPage;
