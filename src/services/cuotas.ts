import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Cuota, CuotaFilter, CuotasResponse } from '@/types/cuotas';

export async function getCuotas(
  token: string,
  filters?: CuotaFilter
): Promise<CuotasResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<CuotasResponse>(`/api/cuotas/${query}`, token);
}

export async function getCuotaById(
  token: string,
  id: number
): Promise<Cuota> {
  return fetchApiAuth<Cuota>(`/api/cuotas/${id}/`, token);
}
