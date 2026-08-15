export interface Casa {
  id: number;
  numero: string;
  privada: number;
  modulo?: number;
  direccion?: string;
  propietario?: string;
  activa: boolean;
}

export interface CasaFilter {
  privada?: number;
  modulo?: number;
  search?: string;
}

export interface CasasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Casa[];
}
