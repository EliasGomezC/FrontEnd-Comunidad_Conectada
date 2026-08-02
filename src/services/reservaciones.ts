import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Reservacion, ReservacionFilter, ReservacionPayload, ReservacionesResponse } from '@/types/reservaciones';

export async function getReservaciones(
  token: string,
  filters?: ReservacionFilter
): Promise<ReservacionesResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ReservacionesResponse>(`/api/reservaciones/${query}`, token);
}

export function createReservacion(token: string, data: ReservacionPayload) {
  return fetchApiAuth<Reservacion>('/api/reservaciones/', token, { method: 'POST', body: JSON.stringify(data) });
}

export function updateReservacion(token: string, id: number, data: Partial<ReservacionPayload>) {
  return fetchApiAuth<Reservacion>(`/api/reservaciones/${id}/`, token, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteReservacion(token: string, id: number) {
  return fetchApiAuth<void>(`/api/reservaciones/${id}/`, token, { method: 'DELETE' });
}

export async function getReservacionById(
  token: string,
  id: number
): Promise<Reservacion> {
  return fetchApiAuth<Reservacion>(`/api/reservaciones/${id}/`, token);
}
