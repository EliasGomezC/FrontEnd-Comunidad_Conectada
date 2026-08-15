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
  id: string
): Promise<Usuario> {
  return fetchApiAuth<Usuario>(`/api/usuarios/${id}/`, token);
}

export async function agregarUsuarioPrivada(token: string, privada: string, data: { email: string; rol: 'moderador' | 'habitante' }) {
  return fetchApiAuth(`/api/privadas/${privada}/miembros/`, token, { method: 'POST', body: JSON.stringify(data) });
}

export async function editarUsuarioPrivada(token: string, privada: string, usuario: string, data: { rol: 'moderador' | 'habitante'; status: 'activo' | 'suspendido' }) {
  return fetchApiAuth(`/api/privadas/${privada}/miembros/${usuario}/`, token, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function actualizarAvatarUsuario(token: string, privada: string, usuario: string, archivo: File) {
  const body = new FormData();
  body.append('avatar', archivo);
  return fetchApiAuth<{ avatar: string }>(`/api/privadas/${privada}/miembros/${usuario}/`, token, { method: 'POST', body });
}

export async function getPerfiles(
  token: string,
  filters?: { search?: string; role?: string }
): Promise<{ count: number; next: string | null; previous: string | null; results: Perfil[] }> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth(`/api/perfiles/${query}`, token);
}
