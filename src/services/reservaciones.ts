import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { Reservacion, ReservacionFilter, ReservacionesResponse } from '@/types/reservaciones';

export async function getReservaciones(
  token: string,
  filters?: ReservacionFilter
): Promise<ReservacionesResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ReservacionesResponse>(`/api/reservaciones/${query}`, token);
}

export async function getReservacionById(
  token: string,
  id: number
): Promise<Reservacion> {
  return fetchApiAuth<Reservacion>(`/api/reservaciones/${id}/`, token);
}
