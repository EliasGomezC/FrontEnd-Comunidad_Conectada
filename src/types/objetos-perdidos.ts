export interface ObjetoPerdido { id:string; num:number; privada:string; reportado_por:string; nombre:string; descripcion:string; imagen:string|null; tipo:string; fecha_reporte:string|null; fecha_encontrado:string|null; fecha_devuelto:string|null; recuperador:string|null; status:string; }
export interface ObjetoPerdidoFilter { privada?:string; reportado_por?:string; tipo?:string; search?:string; page?:number; }
export interface ObjetosPerdidosResponse { count:number; next:string|null; previous:string|null; results:ObjetoPerdido[]; }
