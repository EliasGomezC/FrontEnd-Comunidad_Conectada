export type EstadoReporte = 'pendiente' | 'en_proceso' | 'resuelto' | 'concluido';
export type PrioridadReporte = 'baja' | 'media' | 'alta';
export interface Reporte { id:string; num:number; privada:string; creador:string; supervisor:string|null; titulo:string; descripcion:string; tipo:string; prioridad:PrioridadReporte; estado:EstadoReporte; fecha_suceso:string|null; hora_suceso:string|null; evidencia:string|null; status:string; }
export interface CrearReporteRequest { privada:string; titulo:string; descripcion:string; tipo:string; prioridad:PrioridadReporte; fecha_suceso?:string; hora_suceso?:string; }
export interface ReporteFilter { privada?:string; creador?:string; estado?:EstadoReporte; search?:string; page?:number; }
export interface ReportesResponse { count:number; next:string|null; previous:string|null; results:Reporte[]; }
