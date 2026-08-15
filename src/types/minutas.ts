export type TipoReunion = 'ordinaria'|'extraordinaria'|'comite';
export interface ModeradorMinuta { id:string; nombre:string; email:string; telefono:string; }
export interface Minuta { id:string; privada:string; numero:number; titulo:string; tipo_reunion:TipoReunion; fecha_reunion:string; lugar:string; objetivo:string; asistentes:string; asistentes_lista:string[]; orden_dia:string; acuerdos:string; compromisos:string; observaciones:string; proxima_reunion:string|null; moderador:string; moderador_detalle:ModeradorMinuta; created_at:string; updated_at:string; }
export interface CrearMinuta { privada:string; titulo:string; tipo_reunion:TipoReunion; fecha_reunion:string; lugar:string; objetivo:string; asistentes:string; orden_dia:string; acuerdos:string; compromisos?:string; observaciones?:string; proxima_reunion?:string|null; }
export interface MinutasResponse { count:number; next:string|null; previous:string|null; results:Minuta[]; }
