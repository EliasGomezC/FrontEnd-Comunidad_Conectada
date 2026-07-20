export interface Reporte {
  id: number;
  tipo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  reportado_por?: number;
  fecha_reporte: string;
  ubicacion?: string;
  imagen?: string;
}

export interface ReporteFilter {
  tipo?: string;
  estado?: 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado';
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  search?: string;
}

export interface ReportesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reporte[];
}
