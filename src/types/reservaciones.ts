export interface Reservacion {
  id: number;
  folio: number;
  area: number;
  usuario?: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'pendiente' | 'aprobada' | 'cancelada';
  num_asistentes: number;
  descripcion?: string;
}

export interface ReservacionFilter {
  area?: number;
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
