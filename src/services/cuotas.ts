import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { CrearCuotaRequest, Cuota, CuotaFilter, CuotaResumen, CuotasResponse } from '@/types/cuotas';

export async function getCuotas(
  token: string,
  filters?: CuotaFilter
): Promise<CuotasResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<CuotasResponse>(`/api/cuotas/${query}`, token);
}

export async function getCuotaById(
  token: string,
  id: string
): Promise<Cuota> {
  return fetchApiAuth<Cuota>(`/api/cuotas/${id}/`, token);
}

export async function crearCuota(token: string, payload: CrearCuotaRequest): Promise<Cuota> {
  return fetchApiAuth<Cuota>('/api/cuotas/', token, { method: 'POST', body: JSON.stringify(payload) });
}

export async function getResumenCuota(token: string, id: string): Promise<CuotaResumen> {
  return fetchApiAuth<CuotaResumen>(`/api/cuotas/${id}/resumen/`, token);
}
