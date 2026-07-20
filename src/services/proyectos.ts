import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Proyecto, ProyectoFilter, ProyectosResponse } from '@/types/proyectos';

export async function getProyectos(
  token: string,
  filters?: ProyectoFilter
): Promise<ProyectosResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ProyectosResponse>(`/api/proyectos/${query}`, token);
}

export async function getProyectoById(
  token: string,
  id: number
): Promise<Proyecto> {
  return fetchApiAuth<Proyecto>(`/api/proyectos/${id}/`, token);
}
