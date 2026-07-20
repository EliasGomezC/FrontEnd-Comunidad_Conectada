import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Modulo, ModuloFilter, ModulosResponse } from '@/types/modulos';

export async function getModulos(
  token: string,
  filters?: ModuloFilter
): Promise<ModulosResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ModulosResponse>(`/api/modulos/${query}`, token);
}

export async function getModuloById(
  token: string,
  id: number
): Promise<Modulo> {
  return fetchApiAuth<Modulo>(`/api/modulos/${id}/`, token);
}
