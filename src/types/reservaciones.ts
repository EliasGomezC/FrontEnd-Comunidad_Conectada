export interface Reservacion {
  id: string;
  folio: number;
  area: string;
  usuario?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'pendiente' | 'aprobada' | 'cancelada';
  num_asistentes: number;
  descripcion?: string;
}

export interface ReservacionFilter {
  area?: string;
  fecha?: string;
  estado?: 'pendiente' | 'aprobada' | 'cancelada';
  search?: string;
  page?: number;
}

export type ReservacionPayload = Pick<Reservacion, 'area' | 'fecha' | 'hora_inicio' | 'hora_fin' | 'num_asistentes' | 'descripcion'> & {
  estado?: Reservacion['estado'];
};

export interface ReservacionesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reservacion[];
}
