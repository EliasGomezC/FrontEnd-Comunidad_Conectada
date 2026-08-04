import { fetchApiAuth } from "@/lib/api";
import type { ConfiguracionPrivada } from "@/types/configuracion-privada";

export const getConfiguracionPrivada = (token: string, privada: string) =>
  fetchApiAuth<ConfiguracionPrivada>(`/api/privadas/${privada}/configuracion/`, token);

export const actualizarConfiguracionPrivada = (token: string, privada: string, data: { nombre?: string; contenido?: string }) =>
  fetchApiAuth<ConfiguracionPrivada>(`/api/privadas/${privada}/configuracion/`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
