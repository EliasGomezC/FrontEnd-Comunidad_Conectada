import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { CrearReservacionRequest, Reservacion, ReservacionFilter, ReservacionesResponse } from '@/types/reservaciones';

export async function getReservaciones(
  token: string,
  filters?: ReservacionFilter
): Promise<ReservacionesResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ReservacionesResponse>(`/api/reservaciones/${query}`, token);
}

export async function getReservacionById(
  token: string,
  id: string
): Promise<Reservacion> {
  return fetchApiAuth<Reservacion>(`/api/reservaciones/${id}/`, token);
}

export async function crearReservacion(token:string,payload:CrearReservacionRequest):Promise<Reservacion>{
  return fetchApiAuth<Reservacion>('/api/reservaciones/',token,{method:'POST',body:JSON.stringify(payload)});
}
