import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Casa, CasaFilter, CasasResponse } from '@/types/casas';

export async function getCasas(
  token: string,
  filters?: CasaFilter
): Promise<CasasResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<CasasResponse>(`/api/casas/${query}`, token);
}

export async function getCasaById(
  token: string,
  id: number
): Promise<Casa> {
  return fetchApiAuth<Casa>(`/api/casas/${id}/`, token);
}
