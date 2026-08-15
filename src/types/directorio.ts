export interface DirectorioGaleriaItem {
  id: string;
  url: string;
}

export interface DirectorioContacto {
  id: string;
  privada: string;
  nombre: string;
  categorias: string;
  num_tel: string;
  codigo: string;
  descripcion?: string;
  ubicacion?: string;
  imagenes?: string;
  galeria?: DirectorioGaleriaItem[];
  status: string;
}

export interface DirectorioFilter {
  privada?: string;
  categorias?: string;
  search?: string;
  page?: number;
}

export type DirectorioPayload = Omit<DirectorioContacto, 'id' | 'status' | 'imagenes' | 'galeria'> & {
  imagenes?: File | null;
  galeria_archivos?: File[];
  galeria_eliminar?: string[];
};

export interface DirectorioResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DirectorioContacto[];
}
