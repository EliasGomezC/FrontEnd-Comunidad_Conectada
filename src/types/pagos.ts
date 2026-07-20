export interface Pago {
  id: number;
  cuota: number;
  casa: number;
  monto: number;
  fecha_pago: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  metodo_pago?: string;
  comprobante?: string;
  notas?: string;
}

export interface PagoFilter {
  cuota?: number;
  casa?: number;
  estado?: 'pendiente' | 'aprobado' | 'rechazado';
}

export interface PagosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pago[];
}
