import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Privada, PrivadaFilter, PrivadasResponse } from '@/types/privadas';

export async function getPrivadas(
  token: string,
  filters?: PrivadaFilter
): Promise<PrivadasResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<PrivadasResponse>(`/api/privadas/${query}`, token);
}

export async function getPrivadaById(
  token: string,
  id: number
): Promise<Privada> {
  return fetchApiAuth<Privada>(`/api/privadas/${id}/`, token);
}
