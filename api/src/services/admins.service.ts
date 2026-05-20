import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminsRepository } from '../repositories/admins.repository';
import { LoginAdminDTO } from '../types/admin.types';
import { JwtPayload } from '../types/usuario.types';

const repository = new AdminsRepository();

const generarToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] ?? '7d',
  });
};

export class AdminsService {
  async login(data: LoginAdminDTO) {
    if (!data.email || !data.password) throw new Error('Email y contraseña son requeridos');

    const admin = await repository.findByEmail(data.email.toLowerCase());
    if (!admin) throw new Error('Credenciales inválidas');
    if (!admin.activo) throw new Error('La cuenta está desactivada');

    const passwordValida = await bcrypt.compare(data.password, admin.password_hash);
    if (!passwordValida) throw new Error('Credenciales inválidas');

    const { password_hash, ...adminSinPassword } = admin;
    const token = generarToken({ id: admin.id, email: admin.email, tipo: 'admin' });

    return { admin: adminSinPassword, token };
  }
}
