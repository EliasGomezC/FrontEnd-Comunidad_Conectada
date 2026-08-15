export type TipoPago = 'mensual' | 'unico';

export interface Cuota {
  id: string;
  privada: string;
  clave: string;
  cuenta: string;
  categoria: string;
  descripcion: string;
  nombre: string;
  monto: string;
  fecha_vencimiento: string;
  tipo_pago: TipoPago;
  icono: string;
  color_icono: string;
  mes: string;
  status: string;
  created_at: string;
}

export interface CrearCuotaRequest {
  privada: string;
  cuenta: string;
  categoria: string;
  descripcion: string;
  nombre: string;
  monto: string;
  fecha_vencimiento: string;
  tipo_pago: TipoPago;
  icono: string;
  color_icono: string;
}

export interface CuotaFilter { privada?: string; search?: string; tipo_pago?: TipoPago; categoria?: string; page?: number; }
export interface CuotasResponse { count: number; next: string | null; previous: string | null; results: Cuota[]; }
export interface CuotaResumen { total: number; estados: Record<string, number>; }
