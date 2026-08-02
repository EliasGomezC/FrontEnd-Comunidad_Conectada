export interface Area {
  id: number;
  privada: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  imagen?: string;
  status: string;
}

export interface AreaFilter {
  privada?: number;
  search?: string;
}

export interface AreasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Area[];
}
