import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { DirectorioContacto, DirectorioFilter, DirectorioResponse } from '@/types/directorio';

export async function getDirectorio(
  token: string,
  filters?: DirectorioFilter
): Promise<DirectorioResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<DirectorioResponse>(`/api/directorio/${query}`, token);
}

export async function getContactoById(
  token: string,
  id: number
): Promise<DirectorioContacto> {
  return fetchApiAuth<DirectorioContacto>(`/api/directorio/${id}/`, token);
}
