import sql from '../config/database';
import { Admin } from '../types/admin.types';

export class AdminsRepository {
  async findByEmail(email: string): Promise<(Admin & { password_hash: string }) | null> {
    const result = await new sql.Request()
      .input('email', sql.NVarChar(255), email)
      .query('SELECT * FROM Admins WHERE email = @email');

    return result.recordset[0] ?? null;
  }

  async findById(id: number): Promise<Admin | null> {
    const result = await new sql.Request()
      .input('id', sql.Int, id)
      .query('SELECT id, nombre, apellido, email, activo, created_at FROM Admins WHERE id = @id');

    return result.recordset[0] ?? null;
  }
}
