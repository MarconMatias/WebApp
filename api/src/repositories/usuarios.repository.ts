import sql from '../config/database';
import { Usuario } from '../types/usuario.types';

export class UsuariosRepository {
  async findById(id: number): Promise<Usuario | null> {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query('SELECT id, nombre, apellido, email, telefono, activo, created_at FROM Usuarios WHERE id = @id');

    return result.recordset[0] ?? null;
  }

  async findByEmail(email: string): Promise<(Usuario & { password_hash: string }) | null> {
    const result = await new sql.Request()
      .input('email', sql.NVarChar(255), email)
      .query('SELECT * FROM Usuarios WHERE email = @email');

    return result.recordset[0] ?? null;
  }

  async create(data: {
    nombre: string;
    apellido: string;
    email: string;
    password_hash: string;
    telefono?: string;
  }): Promise<number> {
    const result = await new sql.Request()
      .input('nombre',        sql.NVarChar(100), data.nombre)
      .input('apellido',      sql.NVarChar(100), data.apellido)
      .input('email',         sql.NVarChar(255), data.email)
      .input('password_hash', sql.NVarChar(255), data.password_hash)
      .input('telefono',      sql.NVarChar(20),  data.telefono ?? null)
      .query(`
        INSERT INTO Usuarios (nombre, apellido, email, password_hash, telefono)
        OUTPUT INSERTED.id
        VALUES (@nombre, @apellido, @email, @password_hash, @telefono)
      `);

    return result.recordset[0].id;
  }
}
