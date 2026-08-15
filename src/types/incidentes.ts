export interface Incidente {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'investigacion' | 'resuelto' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  tipo: string;
  fecha_incidente: string;
  reportado_por?: number;
  ubicacion?: string;
  imagen?: string;
}

export interface IncidenteFilter {
  estado?: 'pendiente' | 'investigacion' | 'resuelto' | 'cerrado';
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  tipo?: string;
  search?: string;
}

export interface IncidentesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Incidente[];
}
