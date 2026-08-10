export type TipoObjeto = 'extraviado' | 'resguardado';
export type EstadoCaso = 'activo' | 'posiblemente_localizado' | 'reclamacion_en_revision' | 'recuperado' | 'entregado' | 'cerrado';
export interface UsuarioResumen { id:string; nombre:string; telefono?:string }
export interface PreguntaValidacion { id:string; pregunta:string; orden:number }
export interface MiReclamacion {
  id:string; estado:string; estado_display:string; mensaje:string; notas_revision:string; created_at:string;
  respuestas:{pregunta:string;respuesta:string}[];
}
export interface ObjetoPerdido {
  id:string; num:number; privada:string; reportado_por:string; reportado_por_detalle:UsuarioResumen;
  nombre:string; descripcion:string; tipo:TipoObjeto; estado_caso:EstadoCaso; finalizado:boolean;
  imagen:string|null; ubicacion:string; fecha_evento:string|null; informacion_adicional:string;
  detalles_privados?:string; responsable_resguardo:string|null; posible_localizador:string|null; posible_localizador_detalle:UsuarioResumen|null;
  preguntas?:PreguntaValidacion[]; mi_reclamacion:MiReclamacion|null; created_at:string; updated_at:string;
}
export interface ObjetoPerdidoFilter { privada?:string; reportado_por?:string; tipo?:string; estado_caso?:string; finalizado?:boolean; search?:string; ordering?:string; page?:number; }
export interface ObjetosPerdidosResponse { count:number; next:string|null; previous:string|null; results:ObjetoPerdido[]; }
export interface CrearObjeto { privada:string; nombre:string; descripcion:string; tipo:TipoObjeto; ubicacion:string; fecha_evento:string; informacion_adicional?:string; detalles_privados?:string; preguntas?:string[]; imagen?:File|null }
export interface Reclamacion {
  id:string; objeto:string; estado:string; mensaje:string; notas_revision:string; created_at:string;
  solicitante:string; solicitante_detalle:UsuarioResumen;
  respuestas:{id:string;pregunta:string;pregunta_texto:string;respuesta:string}[];
}
export interface ReclamacionesResponse {count:number;next:string|null;previous:string|null;results:Reclamacion[]}
export interface EntregaObjeto {
  id:string; objeto:string; reclamacion:string|null; entregado_por:string; recibido_por:string; autorizado_por:string;
  resultado:string; fecha_entrega:string; confirmacion_entrega:boolean; confirmacion_recepcion:boolean;
  codigo_temporal:string; codigo_expira_en:string; codigo_usado_en:string|null; confirmada:boolean;
}
export interface EntregasResponse {count:number;next:string|null;previous:string|null;results:EntregaObjeto[]}
