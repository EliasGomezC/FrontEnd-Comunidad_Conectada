export interface ObjetoPerdido {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'activo' | 'encontrado' | 'devuelto' | 'archivado';
  categoria: string;
  tipo: 'perdido' | 'encontrado';
  fecha: string;
  ubicacion?: string;
  imagen?: string;
  propietario?: number;
  encontrado_por?: number;
}

export interface ObjetoPerdidoFilter {
  estado?: 'activo' | 'encontrado' | 'devuelto' | 'archivado';
  categoria?: string;
  search?: string;
}

export interface ObjetosPerdidosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ObjetoPerdido[];
}
