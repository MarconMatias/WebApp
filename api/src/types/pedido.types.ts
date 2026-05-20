export type EstadoPedido = 'pendiente' | 'pagado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
export type TipoEntrega  = 'envio' | 'retiro';

export interface Pedido {
  id: number;
  usuario_id: number;
  estado: EstadoPedido;
  tipo_entrega: TipoEntrega;
  direccion_envio: string | null;
  total: number;
  mp_payment_id: string | null;
  notas: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  variante_id: number;
  cantidad: number;
  precio_unitario: number;
  // joins
  producto_nombre?: string;
  talle?: string;
  color?: string | null;
}

export interface PedidoDetalle extends Pedido {
  items: DetallePedido[];
}

export interface ItemPedidoDTO {
  variante_id: number;
  cantidad: number;
}

export interface CreatePedidoDTO {
  tipo_entrega: TipoEntrega;
  direccion_envio?: string;
  notas?: string;
  items: ItemPedidoDTO[];
}

export interface UpdateEstadoDTO {
  estado: EstadoPedido;
  mp_payment_id?: string;
}
