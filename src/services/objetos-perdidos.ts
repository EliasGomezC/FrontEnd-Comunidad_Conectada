import { fetchApiAuth } from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import type { CrearObjeto, EntregaObjeto, EntregasResponse, ObjetoPerdido, ObjetoPerdidoFilter, ObjetosPerdidosResponse, PreguntaValidacion, Reclamacion, ReclamacionesResponse } from '@/types/objetos-perdidos';

export async function getObjetosPerdidos(token:string, filters?:ObjetoPerdidoFilter):Promise<ObjetosPerdidosResponse>{
  const query=filters?buildQueryString(filters as Record<string,string|number|boolean|undefined>):'';
  return fetchApiAuth(`/api/objetos-perdidos/${query}`,token);
}
export const getObjetoPerdidoById=(token:string,id:string)=>fetchApiAuth<ObjetoPerdido>(`/api/objetos-perdidos/${id}/`,token);
export async function crearObjeto(token:string,data:CrearObjeto){
  const body=new FormData();
  Object.entries(data).forEach(([key,value])=>{
    if(value===undefined||value===null||key==='preguntas')return;
    body.append(key,value instanceof File?value:String(value));
  });
  if(data.preguntas)body.append('preguntas_json',JSON.stringify(data.preguntas));
  return fetchApiAuth<ObjetoPerdido>('/api/objetos-perdidos/',token,{method:'POST',body});
}
export async function actualizarObjeto(token:string,id:string,data:Partial<CrearObjeto>){
  const body=new FormData();
  Object.entries(data).forEach(([key,value])=>{
    if(value===undefined||value===null||key==='preguntas')return;
    body.append(key,value instanceof File?value:String(value));
  });
  if(data.preguntas)body.append('preguntas_json',JSON.stringify(data.preguntas));
  return fetchApiAuth<ObjetoPerdido>(`/api/objetos-perdidos/${id}/`,token,{method:'PATCH',body});
}
export const eliminarObjeto=(token:string,id:string)=>fetchApiAuth<void>(`/api/objetos-perdidos/${id}/`,token,{method:'DELETE'});
export const marcarLocalizado=(token:string,id:string)=>fetchApiAuth<ObjetoPerdido>(`/api/objetos-perdidos/${id}/posiblemente-localizado/`,token,{method:'POST',body:JSON.stringify({})});
export const getPreguntas=(token:string,id:string)=>fetchApiAuth<PreguntaValidacion[]>(`/api/objetos-perdidos/${id}/preguntas-reclamacion/`,token);
export const crearReclamacion=(token:string,objeto:string,mensaje:string,respuestas:{pregunta:string;respuesta:string}[])=>fetchApiAuth<Reclamacion>('/api/reclamaciones-objetos/',token,{method:'POST',body:JSON.stringify({objeto,mensaje,respuestas,evidencias:[]})});
export const getReclamacionesObjeto=(token:string,objeto:string)=>fetchApiAuth<ReclamacionesResponse>(`/api/reclamaciones-objetos/?objeto=${encodeURIComponent(objeto)}`,token);
export const revisarReclamacion=(token:string,id:string,estado:'aprobada'|'rechazada'|'informacion_requerida',notas_revision:string)=>fetchApiAuth<Reclamacion>(`/api/reclamaciones-objetos/${id}/revisar/`,token,{method:'POST',body:JSON.stringify({estado,notas_revision})});
export const getEntregasObjeto=(token:string,objeto:string)=>fetchApiAuth<EntregasResponse>(`/api/entregas-objetos/?objeto=${encodeURIComponent(objeto)}`,token);
export const crearEntrega=(token:string,data:{objeto:string;reclamacion?:string;entregado_por:string;recibido_por:string;resultado:string})=>fetchApiAuth<EntregaObjeto>('/api/entregas-objetos/',token,{method:'POST',body:JSON.stringify(data)});
export const confirmarEntrega=(token:string,id:string,codigo:string,lado?:'entrega'|'recepcion')=>fetchApiAuth<EntregaObjeto>(`/api/entregas-objetos/${id}/confirmar/`,token,{method:'POST',body:JSON.stringify({codigo,lado})});
export const finalizarExtraviado=(token:string,id:string,resultado:string)=>fetchApiAuth<ObjetoPerdido>(`/api/objetos-perdidos/${id}/finalizar-extraviado/`,token,{method:'POST',body:JSON.stringify({resultado})});
export const finalizarResguardado=(token:string,id:string,reclamacion:string)=>fetchApiAuth<ObjetoPerdido>(`/api/objetos-perdidos/${id}/finalizar-resguardado/`,token,{method:'POST',body:JSON.stringify({reclamacion})});
