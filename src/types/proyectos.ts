export type EstadoProyecto='propuesto'|'aprobado'|'en_progreso'|'completado'|'cancelado';
export interface ProyectoGaleriaItem { id:string; url:string; }
export interface Proyecto { id:string; codigo:string; privada:string; nombre:string; descripcion:string; capacidad:number; tipo:string; estado:EstadoProyecto; fecha_inicio:string|null; fecha_fin:string|null; imagen?:string; galeria?:ProyectoGaleriaItem[]; usuario:string; }
export interface ProyectoFilter { estado?:EstadoProyecto; privada?:string; search?:string; page?:number; }
export interface ProyectosResponse { count:number; next:string|null; previous:string|null; results:Proyecto[]; }
