export interface Reservacion {
  id: number;
  area: number;
  area_nombre?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'completado' | 'cancelado';
  solicitante?: number;
  solicitante_nombre?: string;
  notas?: string;
  created_at?: string;
}

export interface ReservacionFilter {
  area?: number;
  fecha?: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado' | 'completado' | 'cancelado';
  search?: string;
}

export interface ReservacionesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reservacion[];
}
