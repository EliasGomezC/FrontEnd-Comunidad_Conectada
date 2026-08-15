export interface Area {
  id: string;
  privada: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  imagen?: string;
  status: string;
}

export interface AreaFilter {
  privada?: string;
  search?: string;
}

export interface AreasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Area[];
}
