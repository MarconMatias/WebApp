export type EstadoEnvio = 'preparando' | 'despachado' | 'en_camino' | 'entregado';

export interface Envio {
  id: number;
  pedido_id: number;
  estado: EstadoEnvio;
  empresa: string | null;
  numero_seguimiento: string | null;
  fecha_despacho: Date | null;
  fecha_entrega_estimada: Date | null;
  fecha_entrega_real: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEnvioDTO {
  pedido_id: number;
  empresa?: string;
  numero_seguimiento?: string;
  fecha_entrega_estimada?: string;
}

export interface UpdateEnvioDTO {
  estado?: EstadoEnvio;
  empresa?: string;
  numero_seguimiento?: string;
  fecha_despacho?: string;
  fecha_entrega_estimada?: string;
  fecha_entrega_real?: string;
}
