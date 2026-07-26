import type { Cuota } from './cuotas';

export type EstadoPago = 'pendiente' | 'en_revision' | 'pagado' | 'atrasado' | 'no_pagado' | 'declinado';
export type EstadoIntento = 'en_revision' | 'aceptado' | 'declinado';

export interface PagoIntento {
  id: string;
  comprobante_url: string;
  estado: EstadoIntento;
  enviado_en: string;
  revisado_en: string | null;
  validador: string | null;
  validador_nombre: string | null;
  motivo_declinado: string;
}

export interface PagadorDetalle { id: string; nombre_completo: string; email: string; telefono: string; }

export interface Pago {
  id: string;
  cuota: string;
  cuota_detalle: Cuota;
  pagador: string;
  pagador_detalle: PagadorDetalle;
  privada: string;
  estado: EstadoPago;
  comprobante_url: string;
  fecha_pago: string | null;
  fecha_validacion: string | null;
  validador: string | null;
  intentos: PagoIntento[];
}

export interface PagoFilter { cuota?: string; privada?: string; estado?: EstadoPago; search?: string; page?: number; }
export interface PagosResponse { count: number; next: string | null; previous: string | null; results: Pago[]; }
export interface PagosResumen { total: number; estados: Record<EstadoPago, number>; }
