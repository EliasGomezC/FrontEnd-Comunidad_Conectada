import {fetchApiAuth} from '@/lib/api';
import {buildQueryString} from '@/lib/utils';
import type {CrearMinuta,Minuta,MinutasResponse} from '@/types/minutas';

export const getMinutas=(token:string,filters?:{privada?:string;search?:string;page?:number})=>fetchApiAuth<MinutasResponse>(`/api/minutas/${filters?buildQueryString(filters as Record<string,string|number|boolean|undefined>):''}`,token);
export const crearMinuta=(token:string,payload:CrearMinuta)=>fetchApiAuth<Minuta>('/api/minutas/',token,{method:'POST',body:JSON.stringify(payload)});
export const editarMinuta=(token:string,id:string,payload:Partial<CrearMinuta>)=>fetchApiAuth<Minuta>(`/api/minutas/${id}/`,token,{method:'PATCH',body:JSON.stringify(payload)});
