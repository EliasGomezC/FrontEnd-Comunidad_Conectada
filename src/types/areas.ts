export interface Area {
  id: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
  capacidad?: number;
  activa: boolean;
  imagen?: string;
}

export interface AreaFilter {
  tipo?: string;
  search?: string;
}

export interface AreasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Area[];
}
