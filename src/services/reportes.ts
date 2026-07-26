import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { CrearReporteRequest, Reporte, ReporteFilter, ReportesResponse } from '@/types/reportes';

export async function getReportes(
  token: string,
  filters?: ReporteFilter
): Promise<ReportesResponse> {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : '';
  return fetchApiAuth<ReportesResponse>(`/api/reportes/${query}`, token);
}

export async function getReporteById(
  token: string,
  id: string
): Promise<Reporte> {
  return fetchApiAuth<Reporte>(`/api/reportes/${id}/`, token);
}

export async function crearReporte(token:string, payload:CrearReporteRequest):Promise<Reporte>{
  return fetchApiAuth<Reporte>('/api/reportes/',token,{method:'POST',body:JSON.stringify(payload)});
}
