import { EnviosRepository } from '../repositories/envios.repository';
import { PedidosRepository } from '../repositories/pedidos.repository';
import { CreateEnvioDTO, UpdateEnvioDTO, EstadoEnvio } from '../types/envio.types';
import { JwtPayload } from '../types/usuario.types';

const repository      = new EnviosRepository();
const pedidosRepo     = new PedidosRepository();

const ESTADOS_VALIDOS: EstadoEnvio[] = ['preparando', 'despachado', 'en_camino', 'entregado'];

export class EnviosService {
  async getByPedido(pedido_id: number, solicitante: JwtPayload) {
    const pedido = await pedidosRepo.findById(pedido_id);
    if (!pedido) throw new Error('Pedido no encontrado');

    if (solicitante.tipo === 'usuario' && pedido.usuario_id !== solicitante.id)
      throw new Error('Sin acceso a este pedido');

    const envio = await repository.findByPedido(pedido_id);
    if (!envio) throw new Error('El pedido aún no tiene envío registrado');

    return envio;
  }

  async create(data: CreateEnvioDTO) {
    const pedido = await pedidosRepo.findById(data.pedido_id);
    if (!pedido) throw new Error('Pedido no encontrado');

    const existente = await repository.findByPedido(data.pedido_id);
    if (existente) throw new Error('El pedido ya tiene un envío registrado');

    if (pedido.tipo_entrega === 'retiro')
      throw new Error('Los pedidos con retiro en local no generan envío');

    if (data.fecha_entrega_estimada && isNaN(Date.parse(data.fecha_entrega_estimada)))
      throw new Error('Fecha de entrega estimada inválida');

    const id = await repository.create(data);
    return repository.findById(id);
  }

  async update(id: number, data: UpdateEnvioDTO) {
    const envio = await repository.findById(id);
    if (!envio) throw new Error('Envío no encontrado');

    if (data.estado !== undefined && !ESTADOS_VALIDOS.includes(data.estado))
      throw new Error(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`);

    for (const campo of ['fecha_despacho', 'fecha_entrega_estimada', 'fecha_entrega_real'] as const) {
      if (data[campo] !== undefined && isNaN(Date.parse(data[campo]!)))
        throw new Error(`${campo} tiene formato de fecha inválido`);
    }

    await repository.update(id, data);
    return repository.findById(id);
  }
}
