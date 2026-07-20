export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'planificacion' | 'en_curso' | 'completado' | 'cancelado' | 'pausado';
  privada?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  responsable?: string;
  presupuesto?: number;
  avance?: number;
}

export interface ProyectoFilter {
  estado?: 'planificacion' | 'en_curso' | 'completado' | 'cancelado' | 'pausado';
  privada?: number;
  search?: string;
}

export interface ProyectosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Proyecto[];
}
