export type EstadoReservacion = 'pendiente' | 'aprobada' | 'cancelada';
export interface Reservacion { id:string; folio:number; area:string; area_nombre:string; usuario:string; usuario_nombre:string; fecha:string; hora_inicio:string; hora_fin:string; num_asistentes:number; estado:EstadoReservacion; descripcion:string; }
export interface CrearReservacionRequest { area:string; fecha:string; hora_inicio:string; hora_fin:string; num_asistentes:number; descripcion:string; }
export interface ReservacionFilter { privada?:string; area?:string; fecha?:string; estado?:EstadoReservacion; search?:string; page?:number; }
export interface ReservacionesResponse { count:number; next:string|null; previous:string|null; results:Reservacion[]; }
