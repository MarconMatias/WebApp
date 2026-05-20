import sql from '../config/database';
import { Pedido, PedidoDetalle, CreatePedidoDTO, UpdateEstadoDTO } from '../types/pedido.types';

export class PedidosRepository {
  async findAll(): Promise<Pedido[]> {
    const result = await new sql.Request()
      .query('SELECT * FROM Pedidos ORDER BY created_at DESC');
    return result.recordset;
  }

  async findByUsuario(usuario_id: number): Promise<Pedido[]> {
    const result = await new sql.Request()
      .input('usuario_id', sql.Int, usuario_id)
      .query('SELECT * FROM Pedidos WHERE usuario_id = @usuario_id ORDER BY created_at DESC');
    return result.recordset;
  }

  async findById(id: number): Promise<PedidoDetalle | null> {
    const pedidoResult = await new sql.Request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Pedidos WHERE id = @id');

    if (pedidoResult.recordset.length === 0) return null;

    const itemsResult = await new sql.Request()
      .input('id', sql.Int, id)
      .query(`
        SELECT
          dp.*,
          p.nombre  AS producto_nombre,
          pv.talle,
          pv.color
        FROM DetallePedido dp
        INNER JOIN ProductoVariantes pv ON pv.id = dp.variante_id
        INNER JOIN Productos p          ON p.id  = pv.producto_id
        WHERE dp.pedido_id = @id
      `);

    return {
      ...pedidoResult.recordset[0],
      items: itemsResult.recordset,
    };
  }

  async getVarianteConPrecio(variante_id: number): Promise<{ disponible: boolean; precio: number } | null> {
    const result = await new sql.Request()
      .input('id', sql.Int, variante_id)
      .query(`
        SELECT pv.disponible, p.precio
        FROM ProductoVariantes pv
        INNER JOIN Productos p ON p.id = pv.producto_id
        WHERE pv.id = @id AND p.activo = 1
      `);

    return result.recordset[0] ?? null;
  }

  async create(
    usuario_id: number,
    data: CreatePedidoDTO,
    total: number,
    preciosPorVariante: Map<number, number>,
  ): Promise<number> {
    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      const pedidoResult = await new sql.Request(transaction)
        .input('usuario_id',     sql.Int,           usuario_id)
        .input('tipo_entrega',   sql.NVarChar(10),  data.tipo_entrega)
        .input('direccion_envio',sql.NVarChar(500),  data.direccion_envio ?? null)
        .input('total',          sql.Decimal(10, 2), total)
        .input('notas',          sql.NVarChar(500),  data.notas ?? null)
        .query(`
          INSERT INTO Pedidos (usuario_id, tipo_entrega, direccion_envio, total, notas)
          OUTPUT INSERTED.id
          VALUES (@usuario_id, @tipo_entrega, @direccion_envio, @total, @notas)
        `);

      const pedido_id: number = pedidoResult.recordset[0].id;

      for (const item of data.items) {
        await new sql.Request(transaction)
          .input('pedido_id',       sql.Int,           pedido_id)
          .input('variante_id',     sql.Int,           item.variante_id)
          .input('cantidad',        sql.Int,           item.cantidad)
          .input('precio_unitario', sql.Decimal(10, 2), preciosPorVariante.get(item.variante_id)!)
          .query(`
            INSERT INTO DetallePedido (pedido_id, variante_id, cantidad, precio_unitario)
            VALUES (@pedido_id, @variante_id, @cantidad, @precio_unitario)
          `);
      }

      await transaction.commit();
      return pedido_id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateEstado(id: number, data: UpdateEstadoDTO): Promise<void> {
    const request = new sql.Request()
      .input('id',     sql.Int,          id)
      .input('estado', sql.NVarChar(20), data.estado)
      .input('updated_at', sql.DateTime2, new Date());

    let query = 'UPDATE Pedidos SET estado = @estado, updated_at = @updated_at';

    if (data.mp_payment_id !== undefined) {
      request.input('mp_payment_id', sql.NVarChar(100), data.mp_payment_id);
      query += ', mp_payment_id = @mp_payment_id';
    }

    query += ' WHERE id = @id';
    await request.query(query);
  }
}
