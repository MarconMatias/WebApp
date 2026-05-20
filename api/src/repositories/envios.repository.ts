import sql from '../config/database';
import { Envio, CreateEnvioDTO, UpdateEnvioDTO } from '../types/envio.types';

export class EnviosRepository {
  async findByPedido(pedido_id: number): Promise<Envio | null> {
    const result = await new sql.Request()
      .input('pedido_id', sql.Int, pedido_id)
      .query('SELECT * FROM Envios WHERE pedido_id = @pedido_id');

    return result.recordset[0] ?? null;
  }

  async findById(id: number): Promise<Envio | null> {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Envios WHERE id = @id');

    return result.recordset[0] ?? null;
  }

  async create(data: CreateEnvioDTO): Promise<number> {
    const result = await new sql.Request()
      .input('pedido_id',             sql.Int,          data.pedido_id)
      .input('empresa',               sql.NVarChar(100), data.empresa ?? null)
      .input('numero_seguimiento',    sql.NVarChar(100), data.numero_seguimiento ?? null)
      .input('fecha_entrega_estimada',sql.DateTime2,     data.fecha_entrega_estimada ?? null)
      .query(`
        INSERT INTO Envios (pedido_id, empresa, numero_seguimiento, fecha_entrega_estimada)
        OUTPUT INSERTED.id
        VALUES (@pedido_id, @empresa, @numero_seguimiento, @fecha_entrega_estimada)
      `);

    return result.recordset[0].id;
  }

  async update(id: number, data: UpdateEnvioDTO): Promise<void> {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const sets: string[] = ['updated_at = GETDATE()'];

    if (data.estado !== undefined) {
      sets.push('estado = @estado');
      request.input('estado', sql.NVarChar(20), data.estado);
    }
    if (data.empresa !== undefined) {
      sets.push('empresa = @empresa');
      request.input('empresa', sql.NVarChar(100), data.empresa);
    }
    if (data.numero_seguimiento !== undefined) {
      sets.push('numero_seguimiento = @numero_seguimiento');
      request.input('numero_seguimiento', sql.NVarChar(100), data.numero_seguimiento);
    }
    if (data.fecha_despacho !== undefined) {
      sets.push('fecha_despacho = @fecha_despacho');
      request.input('fecha_despacho', sql.DateTime2, new Date(data.fecha_despacho));
    }
    if (data.fecha_entrega_estimada !== undefined) {
      sets.push('fecha_entrega_estimada = @fecha_entrega_estimada');
      request.input('fecha_entrega_estimada', sql.DateTime2, new Date(data.fecha_entrega_estimada));
    }
    if (data.fecha_entrega_real !== undefined) {
      sets.push('fecha_entrega_real = @fecha_entrega_real');
      request.input('fecha_entrega_real', sql.DateTime2, new Date(data.fecha_entrega_real));
    }

    await request.query(`UPDATE Envios SET ${sets.join(', ')} WHERE id = @id`);
  }
}
