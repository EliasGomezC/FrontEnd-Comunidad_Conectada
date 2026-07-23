export interface Privada {
  id: string;
  nombre: string;
  codigo: string;
  modulos: Array<{ id: string; nombre: string }>;
  dir_num_exterior?: string;
  dir_colonia?: string;
  dir_calle?: string;
  dir_cp?: string;
  dir_ciudad?: string;
  dir_estado?: string;
  creador: string;
  status: string;
}

export interface PrivateResponse {
  privada: Privada;
  membresia: import('./auth').Membership;
}

export interface ModuloSistema {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  orden: number;
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
