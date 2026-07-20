export interface Cuota {
  id: number;
  privada: number;
  concepto: string;
  monto: number;
  anio: number;
  mes: number;
  estado: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  fecha_vencimiento: string;
  descripcion?: string;
}

export interface CuotaFilter {
  privada?: number;
  anio?: number;
  mes?: number;
  estado?: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
}

export interface CuotasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cuota[];
}
