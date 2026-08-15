import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Pago, PagoFilter, PagosResponse, PagosResumen } from '@/types/pagos';

export async function getPagos(
  token: string,
  filters?: PagoFilter
): Promise<PagosResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<PagosResponse>(`/api/pagos/${query}`, token);
}

export async function getPagoById(
  token: string,
  id: string
): Promise<Pago> {
  return fetchApiAuth<Pago>(`/api/pagos/${id}/`, token);
}

export async function getResumenPagos(token: string, filters?: PagoFilter): Promise<PagosResumen> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<PagosResumen>(`/api/pagos/resumen/${query}`, token);
}

export async function subirComprobante(token: string, pagoId: string, archivo: File): Promise<Pago> {
  const formData = new FormData();
  formData.append('comprobante', archivo);
  return fetchApiAuth<Pago>(`/api/pagos/${pagoId}/comprobante/`, token, { method: 'POST', body: formData });
}

export async function validarPago(token: string, pagoId: string, estado: 'aceptado' | 'declinado', motivo = ''): Promise<Pago> {
  return fetchApiAuth<Pago>(`/api/pagos/${pagoId}/validar/`, token, {
    method: 'POST', body: JSON.stringify({ estado, motivo }),
  });
}
