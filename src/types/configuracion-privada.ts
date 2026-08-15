import type { Privada } from "./privadas";

export interface ReglamentoPrivada {
  id: string;
  privada: string;
  privada_nombre: string;
  contenido: string;
  actualizado_por_nombre: string;
  updated_at: string;
}

export interface ConfiguracionPrivada {
  privada: Privada;
  reglamento: ReglamentoPrivada;
  puede_editar: boolean;
}
