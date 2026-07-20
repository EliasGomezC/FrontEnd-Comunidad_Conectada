export interface DirectorioContacto {
  id: number;
  nombre: string;
  categoria: string;
  telefono: string;
  horario?: string;
  descripcion?: string;
  email?: string;
}

export interface DirectorioFilter {
  categoria?: string;
  search?: string;
}

export interface DirectorioResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DirectorioContacto[];
}
