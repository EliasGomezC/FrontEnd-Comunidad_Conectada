export interface Area { id:string; privada:string; codigo:string; nombre:string; descripcion:string; imagen:string|null; capacidad:number; status:string; }
export interface AreaFilter { privada?:string; search?:string; page?:number; }
export interface AreasResponse { count:number; next:string|null; previous:string|null; results:Area[]; }
