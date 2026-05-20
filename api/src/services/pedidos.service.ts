import { PedidosRepository } from '../repositories/pedidos.repository';
import { CreatePedidoDTO, UpdateEstadoDTO, EstadoPedido } from '../types/pedido.types';
import { JwtPayload } from '../types/usuario.types';

const repository = new PedidosRepository();

const ESTADOS_VALIDOS: EstadoPedido[] = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado'];

export class PedidosService {
  async getAll(solicitante: JwtPayload) {
    if (solicitante.tipo === 'admin') return repository.findAll();
    return repository.findByUsuario(solicitante.id);
  }

  async getById(id: number, solicitante: JwtPayload) {
    const pedido = await repository.findById(id);
    if (!pedido) throw new Error('Pedido no encontrado');

    // usuario solo puede ver sus propios pedidos
    if (solicitante.tipo === 'usuario' && pedido.usuario_id !== solicitante.id)
      throw new Error('Sin acceso a este pedido');

    return pedido;
  }

  async create(usuario_id: number, data: CreatePedidoDTO) {
    if (!data.items || data.items.length === 0)
      throw new Error('El pedido debe tener al menos un producto');

    if (data.tipo_entrega === 'envio' && !data.direccion_envio?.trim())
      throw new Error('La dirección de envío es requerida');

    // validar variantes y calcular total
    const preciosPorVariante = new Map<number, number>();
    let total = 0;

    for (const item of data.items) {
      if (item.cantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');

      const variante = await repository.getVarianteConPrecio(item.variante_id);
      if (!variante) throw new Error(`La variante ${item.variante_id} no existe o el producto está inactivo`);
      if (!variante.disponible) throw new Error(`La variante ${item.variante_id} no está disponible`);

      preciosPorVariante.set(item.variante_id, variante.precio);
      total += variante.precio * item.cantidad;
    }

    const id = await repository.create(usuario_id, data, total, preciosPorVariante);
    return repository.findById(id);
  }

  async updateEstado(id: number, data: UpdateEstadoDTO) {
    if (!ESTADOS_VALIDOS.includes(data.estado))
      throw new Error(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`);

    const pedido = await repository.findById(id);
    if (!pedido) throw new Error('Pedido no encontrado');

    await repository.updateEstado(id, data);
    return repository.findById(id);
  }
}
