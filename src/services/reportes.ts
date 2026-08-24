import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { CrearIncidenteReporteRequest, CrearReporteRequest, IncidenteReporte, IncidenteReporteFilter, IncidentesReporteResponse, Reporte, ReporteFilter, ReportesResponse, TipoReporte } from '@/types/reportes';

const query = (filters?:Record<string, string|number|boolean|undefined>) => filters ? buildQueryString(filters) : '';
export const getTiposReporte = (token:string) => fetchApiAuth<TipoReporte[]>('/api/tipos-reporte/',token);
export const getIncidentesReportes = (token:string,filters?:IncidenteReporteFilter) => fetchApiAuth<IncidentesReporteResponse>(`/api/incidentes/${query(filters as Record<string,string|number|boolean|undefined>)}`,token);
export async function crearIncidenteReporte(token:string,payload:CrearIncidenteReporteRequest):Promise<IncidenteReporte>{
  const body=new FormData();
  body.append('privada',payload.privada); body.append('titulo',payload.titulo); body.append('descripcion',payload.descripcion);
  body.append('tipo_categoria',payload.tipo_categoria); body.append('prioridad',payload.prioridad);
  body.append('fecha_incidente',payload.fecha_incidente); body.append('ubicacion',payload.ubicacion);
  if(payload.evidencia) body.append('evidencia_archivo',payload.evidencia);
  payload.galeria_archivos?.forEach((file)=>body.append('galeria_archivos',file));
  payload.galeria_eliminar?.forEach((id)=>body.append('galeria_eliminar',id));
  return fetchApiAuth<IncidenteReporte>('/api/incidentes/',token,{method:'POST',body});
}
export async function editarIncidenteReporte(token:string,id:string,payload:CrearIncidenteReporteRequest):Promise<IncidenteReporte>{
  const body=new FormData();
  body.append('privada',payload.privada); body.append('titulo',payload.titulo); body.append('descripcion',payload.descripcion);
  body.append('tipo_categoria',payload.tipo_categoria); body.append('prioridad',payload.prioridad);
  body.append('fecha_incidente',payload.fecha_incidente); body.append('ubicacion',payload.ubicacion);
  if(payload.evidencia) body.append('evidencia_archivo',payload.evidencia);
  payload.galeria_archivos?.forEach((file)=>body.append('galeria_archivos',file));
  payload.galeria_eliminar?.forEach((id)=>body.append('galeria_eliminar',id));
  return fetchApiAuth<IncidenteReporte>(`/api/incidentes/${id}/`,token,{method:'PATCH',body});
}
export const getReportes = (token:string,filters?:ReporteFilter) => fetchApiAuth<ReportesResponse>(`/api/reportes/${query(filters as Record<string,string|number|boolean|undefined>)}`,token);
export const getReporteById = (token:string,id:string) => fetchApiAuth<Reporte>(`/api/reportes/${id}/`,token);
export const crearReporte = (token:string,payload:CrearReporteRequest) => {
  const body=new FormData(); body.append('incidente',payload.incidente); body.append('titulo',payload.titulo); body.append('descripcion',payload.descripcion);
  if(payload.evidencia) body.append('evidencia_archivo',payload.evidencia);
  payload.galeria_archivos?.forEach((file)=>body.append('galeria_archivos',file));
  payload.galeria_eliminar?.forEach((id)=>body.append('galeria_eliminar',id));
  return fetchApiAuth<Reporte>('/api/reportes/',token,{method:'POST',body});
};
export const editarReporte = (token:string,id:string,payload:{titulo:string;descripcion:string;evidencia?:File|null}) => {
  const body=new FormData(); body.append('titulo',payload.titulo); body.append('descripcion',payload.descripcion);
  if(payload.evidencia) body.append('evidencia_archivo',payload.evidencia);
  return fetchApiAuth<Reporte>(`/api/reportes/${id}/`,token,{method:'PATCH',body});
};
export const concluirReporte = (token:string,id:string) => fetchApiAuth<Reporte>(`/api/reportes/${id}/concluir/`,token,{method:'POST'});
