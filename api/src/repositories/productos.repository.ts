import sql from '../config/database';
import {
  Producto,
  ProductoDetalle,
  CreateProductoDTO,
  UpdateProductoDTO,
  ProductoFiltros,
} from '../types/producto.types';

export class ProductosRepository {
  async findAll(filtros: ProductoFiltros = {}): Promise<Producto[]> {
    const request = new sql.Request();

    let query = `
      SELECT
        p.*,
        c.nombre AS categoria_nombre,
        pi.url   AS imagen_principal
      FROM Productos p
      INNER JOIN Categorias c         ON c.id = p.categoria_id
      LEFT  JOIN ProductoImagenes pi  ON pi.producto_id = p.id AND pi.es_principal = 1
      WHERE p.activo = 1
    `;

    if (filtros.categoria_id !== undefined) {
      query += ' AND p.categoria_id = @categoria_id';
      request.input('categoria_id', sql.Int, filtros.categoria_id);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await request.query(query);
    return result.recordset;
  }

  async findById(id: number): Promise<ProductoDetalle | null> {
    const productoResult = await new sql.Request()
      .input('id', sql.Int, id)
      .query(`
        SELECT p.*, c.nombre AS categoria_nombre
        FROM Productos p
        INNER JOIN Categorias c ON c.id = p.categoria_id
        WHERE p.id = @id
      `);

    if (productoResult.recordset.length === 0) return null;

    const [variantesResult, imagenesResult] = await Promise.all([
      new sql.Request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM ProductoVariantes WHERE producto_id = @id ORDER BY talle'),
      new sql.Request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM ProductoImagenes WHERE producto_id = @id ORDER BY orden'),
    ]);

    return {
      ...productoResult.recordset[0],
      variantes: variantesResult.recordset,
      imagenes: imagenesResult.recordset,
    };
  }

  async create(data: CreateProductoDTO): Promise<number> {
    const result = await new sql.Request()
      .input('categoria_id', sql.Int, data.categoria_id)
      .input('nombre', sql.NVarChar(200), data.nombre)
      .input('descripcion', sql.NVarChar(sql.MAX), data.descripcion ?? null)
      .input('precio', sql.Decimal(10, 2), data.precio)
      .query(`
        INSERT INTO Productos (categoria_id, nombre, descripcion, precio)
        OUTPUT INSERTED.id
        VALUES (@categoria_id, @nombre, @descripcion, @precio)
      `);

    return result.recordset[0].id;
  }

  async update(id: number, data: UpdateProductoDTO): Promise<void> {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const sets: string[] = ['updated_at = GETDATE()'];

    if (data.categoria_id !== undefined) {
      sets.push('categoria_id = @categoria_id');
      request.input('categoria_id', sql.Int, data.categoria_id);
    }
    if (data.nombre !== undefined) {
      sets.push('nombre = @nombre');
      request.input('nombre', sql.NVarChar(200), data.nombre);
    }
    if (data.descripcion !== undefined) {
      sets.push('descripcion = @descripcion');
      request.input('descripcion', sql.NVarChar(sql.MAX), data.descripcion);
    }
    if (data.precio !== undefined) {
      sets.push('precio = @precio');
      request.input('precio', sql.Decimal(10, 2), data.precio);
    }
    if (data.activo !== undefined) {
      sets.push('activo = @activo');
      request.input('activo', sql.Bit, data.activo ? 1 : 0);
    }

    await request.query(`UPDATE Productos SET ${sets.join(', ')} WHERE id = @id`);
  }

  async deactivate(id: number): Promise<void> {
    await new sql.Request()
      .input('id', sql.Int, id)
      .query('UPDATE Productos SET activo = 0, updated_at = GETDATE() WHERE id = @id');
  }
}
