import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import {
  Usuario,
  UsuarioFilter,
  UsuariosResponse,
  Perfil,
} from '@/types';

export async function getUsuarios(
  token: string,
  filters?: UsuarioFilter
): Promise<UsuariosResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<UsuariosResponse>(`/api/usuarios/${query}`, token);
}

export async function getUsuarioById(
  token: string,
  id: number
): Promise<Usuario> {
  return fetchApiAuth<Usuario>(`/api/usuarios/${id}/`, token);
}

export async function getPerfiles(
  token: string,
  filters?: { search?: string; role?: string }
): Promise<{ count: number; next: string | null; previous: string | null; results: Perfil[] }> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth(`/api/perfiles/${query}`, token);
}
