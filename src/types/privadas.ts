export interface Privada {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  direccion?: string;
  activa: boolean;
}

export interface PrivadaFilter {
  search?: string;
  codigo?: string;
}

export interface PrivadasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Privada[];
}
