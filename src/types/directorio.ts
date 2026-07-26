export interface DirectorioContacto { id:string; privada:string; nombre:string; categorias:string; num_tel:string; codigo:string; descripcion:string; ubicacion:string; imagenes:string|null; status:string; }
export interface DirectorioFilter { privada?:string; categorias?:string; search?:string; page?:number; }
export interface DirectorioResponse { count:number; next:string|null; previous:string|null; results:DirectorioContacto[]; }
