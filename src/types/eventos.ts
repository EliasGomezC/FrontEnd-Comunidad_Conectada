export interface Evento {
  id: number;
  privada: number;
  titulo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  ubicacion?: string;
  capacidad?: number | null;
  imagen?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EventoFilter {
  privada?: number;
  search?: string;
  page?: number;
}

export interface EventosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Evento[];
}

export type EventoPayload = Omit<Evento, 'id' | 'status' | 'created_at' | 'updated_at' | 'imagen'> & { imagen?: File | null };
