import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { Evento, EventoFilter, EventoPayload, EventosResponse } from '@/types/eventos';

function toFormData(data: Partial<EventoPayload>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value instanceof File ? value : String(value));
  });
  return formData;
}

export function getEventos(token: string, filters?: EventoFilter) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<EventosResponse>(`/api/eventos/${query}`, token);
}

export function createEvento(token: string, data: EventoPayload) {
  return fetchApiAuth<Evento>('/api/eventos/', token, { method: 'POST', body: toFormData(data) });
}

export function updateEvento(token: string, id: string, data: Partial<EventoPayload>) {
  return fetchApiAuth<Evento>(`/api/eventos/${id}/`, token, { method: 'PATCH', body: toFormData(data) });
}

export function deleteEvento(token: string, id: string) {
  return fetchApiAuth<void>(`/api/eventos/${id}/`, token, { method: 'DELETE' });
}
