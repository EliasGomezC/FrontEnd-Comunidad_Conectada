import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { DirectorioContacto, DirectorioFilter, DirectorioPayload, DirectorioResponse } from '@/types/directorio';

export async function getDirectorio(
  token: string,
  filters?: DirectorioFilter
): Promise<DirectorioResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<DirectorioResponse>(`/api/directorio/${query}`, token);
}

function toFormData(data: Partial<DirectorioPayload>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value instanceof File ? value : String(value));
  });
  return formData;
}

export function createContacto(token: string, data: DirectorioPayload) {
  return fetchApiAuth<DirectorioContacto>('/api/directorio/', token, { method: 'POST', body: toFormData(data) });
}

export function updateContacto(token: string, id: string, data: Partial<DirectorioPayload>) {
  return fetchApiAuth<DirectorioContacto>(`/api/directorio/${id}/`, token, { method: 'PATCH', body: toFormData(data) });
}

export function deleteContacto(token: string, id: string) {
  return fetchApiAuth<void>(`/api/directorio/${id}/`, token, { method: 'DELETE' });
}

export async function getContactoById(
  token: string,
  id: string
): Promise<DirectorioContacto> {
  return fetchApiAuth<DirectorioContacto>(`/api/directorio/${id}/`, token);
}
