import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Incidente, IncidenteFilter, IncidentesResponse } from '@/types/incidentes';

export async function getIncidentes(
  token: string,
  filters?: IncidenteFilter
): Promise<IncidentesResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<IncidentesResponse>(`/api/incidentes/${query}`, token);
}

export async function getIncidenteById(
  token: string,
  id: number
): Promise<Incidente> {
  return fetchApiAuth<Incidente>(`/api/incidentes/${id}/`, token);
}
