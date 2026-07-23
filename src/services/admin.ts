import { fetchApiAuth } from "@/lib/api";
import type { ModuloSistema } from "@/types/privadas";

export interface AdminPrivate {
  id: string;
  codigo: string;
  nombre: string;
  creador: string;
  habitantes: number;
  modulos_contratados: string[];
  status: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin";
  is_active: boolean;
}

export function getAdminPrivadas(token: string) {
  return fetchApiAuth<AdminPrivate[]>("/api/admin/privadas/", token);
}

export function getAdminModulos(token: string) {
  return fetchApiAuth<ModuloSistema[]>("/api/admin/modulos/", token);
}

export function crearModulo(token: string, data: { codigo: string; nombre: string; descripcion?: string; orden?: number }) {
  return fetchApiAuth<ModuloSistema>("/api/admin/modulos/", token, { method: "POST", body: JSON.stringify(data) });
}

export function crearAdmin(token: string, data: Record<string, string>) {
  return fetchApiAuth<AdminUser>("/api/admin/usuarios/", token, { method: "POST", body: JSON.stringify(data) });
}

export function actualizarModulosPrivada(token: string, privadaId: string, modulos_contratados: string[]) {
  return fetchApiAuth<AdminPrivate>(`/api/admin/privadas/${privadaId}/modulos/`, token, {
    method: "PATCH",
    body: JSON.stringify({ modulos_contratados }),
  });
}

export function cambiarPassword(token: string, data: { password_actual: string; password: string; password_confirm: string }) {
  return fetchApiAuth<{ detail: string }>("/api/usuarios/me/password/", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
