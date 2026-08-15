export interface Modulo {
  id: number;
  nombre: string;
  descripcion?: string;
  privada: number;
  activo: boolean;
  orden?: number;
}

export interface ModuloFilter {
  privada?: number;
  search?: string;
}

export interface ModulosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Modulo[];
}
