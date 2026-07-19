export interface LostObject {
  id: number;
  title: string;
  description: string;
  date: string;
  owner: string;
  image: string;
  type: "lost" | "found";
  status: "active" | "completed";
}

const objects: LostObject[] = [
  {
    id: 1,
    title: "Llavero plateado",
    description: "Llavero con argollas plateadas y un dije de estrella",
    date: "14 Jun 2026",
    owner: "Ana Martínez",
    image: "",
    type: "lost",
    status: "active",
  },
  {
    id: 2,
    title: "Cartera negra",
    description: "Cartera de piel negra con cierre metálico",
    date: "10 Jun 2026",
    owner: "Juan Pérez",
    image: "",
    type: "found",
    status: "active",
  },
  {
    id: 3,
    title: "Libreta de apuntes",
    description: "Libreta pasta dura color azul con hojas rayadas",
    date: "08 Jun 2026",
    owner: "María García",
    image: "",
    type: "lost",
    status: "active",
  },
  {
    id: 4,
    title: "Termo metálico",
    description: "Termo de acero inoxidable color plata 500ml",
    date: "05 Jun 2026",
    owner: "Carlos López",
    image: "",
    type: "found",
    status: "active",
  },
  {
    id: 5,
    title: "Cargador USB-C",
    description: "Cargador rápido marca Samsung 25W color blanco",
    date: "01 Jun 2026",
    owner: "Roberto Sánchez",
    image: "",
    type: "lost",
    status: "active",
  },
  {
    id: 6,
    title: "Audífonos Bluetooth",
    description: "Audífonos inalámbricos color negro marca Sony",
    date: "28 May 2026",
    owner: "Laura Jiménez",
    image: "",
    type: "found",
    status: "active",
  },
  {
    id: 7,
    title: "Paraguas azul",
    description: "Paraguas plegable color azul marino con mango curvo",
    date: "20 May 2026",
    owner: "Pedro Ramírez",
    image: "",
    type: "lost",
    status: "completed",
  },
  {
    id: 8,
    title: "Mochila escolar",
    description: "Mochila negra marca Adidas con logo blanco",
    date: "15 May 2026",
    owner: "Sofía Torres",
    image: "",
    type: "found",
    status: "completed",
  },
  {
    id: 9,
    title: "Gafas de sol",
    description: "Gafas de sol estilo aviador con marco dorado",
    date: "10 May 2026",
    owner: "Diego Hernández",
    image: "",
    type: "lost",
    status: "completed",
  },
  {
    id: 10,
    title: "Reloj de pulsera",
    description: "Reloj digital Casio color negro con correa de resina",
    date: "05 May 2026",
    owner: "Valentina Ruiz",
    image: "",
    type: "found",
    status: "completed",
  },
];

export default objects;
