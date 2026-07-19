export interface Payment {
  id: number;
  title: string;
  description: string;
  month: string;
  paymentType: "Mensual" | "Único";
  dueDate: string;
  amount: number;
  icon: "cleaning" | "security" | "garden" | "event";
  color: "orange" | "blue" | "green" | "purple";
}

export const payments: Payment[] = [
  {
    id: 1,
    title: "Servicio de limpieza",
    description: "Mantenimiento mensual.",
    month: "FEBRERO",
    paymentType: "Mensual",
    dueDate: "28 Feb 2026",
    amount: 5.00,
    icon: "cleaning",
    color: "orange",
  },
  {
    id: 2,
    title: "Seguridad Privada",
    description: "Vigilancia 24/7.",
    month: "FEBRERO",
    paymentType: "Mensual",
    dueDate: "28 Feb 2026",
    amount: 15.00,
    icon: "security",
    color: "blue",
  },
  {
    id: 3,
    title: "Jardinería",
    description: "Mantenimiento de áreas.",
    month: "FEBRERO",
    paymentType: "Único",
    dueDate: "3 Abr 2026",
    amount: 50.00,
    icon: "garden",
    color: "green",
  },
  {
    id: 4,
    title: "Evento Semana Santa",
    description: "Cooperación extraordinaria.",
    month: "ENERO",
    paymentType: "Único",
    dueDate: "3 Abr 2026",
    amount: 50.00,
    icon: "event",
    color: "purple",
  },
  {
    id: 5,
    title: "Servicio de limpieza",
    description: "Mantenimiento mensual.",
    month: "ENERO",
    paymentType: "Mensual",
    dueDate: "31 Ene 2026",
    amount: 5.00,
    icon: "cleaning",
    color: "orange",
  },
  {
    id: 6,
    title: "Seguridad Privada",
    description: "Vigilancia 24/7.",
    month: "ENERO",
    paymentType: "Mensual",
    dueDate: "31 Ene 2026",
    amount: 15.00,
    icon: "security",
    color: "blue",
  },
];
