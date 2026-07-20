import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Pago, PagoFilter, PagosResponse } from '@/types/pagos';

export async function getPagos(
  token: string,
  filters?: PagoFilter
): Promise<PagosResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<PagosResponse>(`/api/pagos/${query}`, token);
}

export async function getPagoById(
  token: string,
  id: number
): Promise<Pago> {
  return fetchApiAuth<Pago>(`/api/pagos/${id}/`, token);
}
