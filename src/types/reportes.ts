export type PrioridadReporte = 'baja' | 'media' | 'alta';
export type EstadoIncidenteReporte = 'pendiente' | 'en_proceso' | 'resuelto';
export type EstadoReporte = 'pendiente' | 'en_proceso' | 'resuelto' | 'concluido';

export interface TipoReporte { id:string; codigo:string; nombre:string; }
export interface PersonaResumen { id:string; nombre:string; email:string; telefono:string; }
export interface IncidenteReporte {
  id:string; num:number; titulo:string; descripcion:string; tipo_categoria:string; tipo_detalle:TipoReporte;
  prioridad:PrioridadReporte; estado:EstadoIncidenteReporte; fecha_incidente:string; fecha_registro:string;
  ubicacion:string; evidencia:string; usuario:string; habitante:PersonaResumen; privada:string;
  tiene_reporte:boolean; reporte_id:string|null; created_at:string;
}
export interface Reporte {
  id:string; num:number; privada:string; incidente:string; incidente_detalle:IncidenteReporte; creador:string;
  moderador:PersonaResumen; titulo:string; descripcion:string; tipo_categoria:string; tipo_detalle:TipoReporte;
  prioridad:PrioridadReporte; estado:EstadoReporte; fecha_suceso:string; evidencia:string;
  created_at:string; updated_at:string;
}
export interface CrearIncidenteReporteRequest { privada:string; titulo:string; descripcion:string; tipo_categoria:string; prioridad:PrioridadReporte; fecha_incidente:string; ubicacion:string; evidencia?:File|null; }
export interface CrearReporteRequest { incidente:string; titulo:string; descripcion:string; evidencia?:File|null; }
export interface ReporteFilter { privada?:string; incidente?:string; creador?:string; estado?:EstadoReporte; search?:string; page?:number; }
export interface IncidenteReporteFilter { privada?:string; usuario?:string; estado?:EstadoIncidenteReporte; search?:string; page?:number; }
export interface Paginated<T> { count:number; next:string|null; previous:string|null; results:T[]; }
export type ReportesResponse = Paginated<Reporte>;
export type IncidentesReporteResponse = Paginated<IncidenteReporte>;
