import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { ObjetoPerdido, ObjetoPerdidoFilter, ObjetosPerdidosResponse } from '@/types/objetos-perdidos';

export async function getObjetosPerdidos(
  token: string,
  filters?: ObjetoPerdidoFilter
): Promise<ObjetosPerdidosResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ObjetosPerdidosResponse>(`/api/objetos-perdidos/${query}`, token);
}

export async function getObjetoPerdidoById(
  token: string,
  id: string
): Promise<ObjetoPerdido> {
  return fetchApiAuth<ObjetoPerdido>(`/api/objetos-perdidos/${id}/`, token);
}
