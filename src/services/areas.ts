import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Area, AreaFilter, AreasResponse } from '@/types/areas';

export async function getAreas(
  token: string,
  filters?: AreaFilter
): Promise<AreasResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<AreasResponse>(`/api/areas/${query}`, token);
}

export async function getAreaById(
  token: string,
  id: string
): Promise<Area> {
  return fetchApiAuth<Area>(`/api/areas/${id}/`, token);
}
