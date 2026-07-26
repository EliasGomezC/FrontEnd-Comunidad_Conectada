import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Membership } from '@/types/auth';
import { ModuloSistema, Privada, PrivadaFilter, PrivadasResponse, PrivateResponse } from '@/types/privadas';

export async function getModulosSistema(token: string): Promise<ModuloSistema[]> {
  return fetchApiAuth<ModuloSistema[]>('/api/modulos-sistema/', token);
}

export async function getPrivadas(
  token: string,
  filters?: PrivadaFilter
): Promise<PrivadasResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<PrivadasResponse>(`/api/privadas/${query}`, token);
}

export async function getPrivadaById(
  token: string,
  id: string
): Promise<Privada> {
  return fetchApiAuth<Privada>(`/api/privadas/${id}/`, token);
}

export async function getMisPrivadas(token: string): Promise<Membership[]> {
  return fetchApiAuth<Membership[]>('/api/privadas/mias/', token);
}

export async function crearPrivada(
  token: string,
  data: {
    nombre: string;
    modulos?: string[];
    modulos_contratados: string[];
    dir_num_exterior?: string;
    dir_colonia?: string;
    dir_calle?: string;
    dir_cp?: string;
    dir_ciudad?: string;
    dir_estado?: string;
  }
): Promise<PrivateResponse> {
  return fetchApiAuth<PrivateResponse>('/api/privadas/crear/', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function unirseAPrivada(token: string, codigo: string): Promise<PrivateResponse> {
  return fetchApiAuth<PrivateResponse>('/api/privadas/unirse/', token, {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  });
}

export async function promoverModerador(
  token: string,
  privadaId: string,
  usuarioId: string
): Promise<Membership> {
  return fetchApiAuth<Membership>(
    `/api/privadas/${privadaId}/miembros/${usuarioId}/promover/`,
    token,
    { method: 'POST' }
  );
}
