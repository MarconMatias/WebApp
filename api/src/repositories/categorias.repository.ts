import sql from '../config/database';
import { Categoria, CreateCategoriaDTO, UpdateCategoriaDTO } from '../types/categoria.types';

export class CategoriasRepository {
  async findAll(): Promise<Categoria[]> {
    const result = await new sql.Request()
      .query('SELECT * FROM Categorias WHERE activa = 1 ORDER BY nombre');
    return result.recordset;
  }

  async findById(id: number): Promise<Categoria | null> {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Categorias WHERE id = @id');

    return result.recordset[0] ?? null;
  }

  async findByNombre(nombre: string): Promise<Categoria | null> {
    const result = await new sql.Request()
      .input('nombre', sql.NVarChar(100), nombre)
      .query('SELECT * FROM Categorias WHERE nombre = @nombre');

    return result.recordset[0] ?? null;
  }

  async create(data: CreateCategoriaDTO): Promise<number> {
    const result = await new sql.Request()
      .input('nombre', sql.NVarChar(100), data.nombre)
      .query(`
        INSERT INTO Categorias (nombre)
        OUTPUT INSERTED.id
        VALUES (@nombre)
      `);

    return result.recordset[0].id;
  }

  async update(id: number, data: UpdateCategoriaDTO): Promise<void> {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const sets: string[] = [];

    if (data.nombre !== undefined) {
      sets.push('nombre = @nombre');
      request.input('nombre', sql.NVarChar(100), data.nombre);
    }
    if (data.activa !== undefined) {
      sets.push('activa = @activa');
      request.input('activa', sql.Bit, data.activa ? 1 : 0);
    }

    await request.query(`UPDATE Categorias SET ${sets.join(', ')} WHERE id = @id`);
  }

  async deactivate(id: number): Promise<void> {
    await new sql.Request()
      .input('id', sql.Int, id)
      .query('UPDATE Categorias SET activa = 0 WHERE id = @id');
  }
}
