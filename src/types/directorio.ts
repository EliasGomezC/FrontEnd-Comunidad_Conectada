export interface DirectorioContacto {
  id: number;
  privada: number;
  nombre: string;
  categorias: string;
  num_tel: string;
  codigo: string;
  descripcion?: string;
  ubicacion?: string;
  imagenes?: string;
  status: string;
}

export interface DirectorioFilter {
  privada?: number;
  categorias?: string;
  search?: string;
  page?: number;
}

export type DirectorioPayload = Omit<DirectorioContacto, 'id' | 'status' | 'imagenes'> & { imagenes?: File | null };

export interface DirectorioResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DirectorioContacto[];
}
