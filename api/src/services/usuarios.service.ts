import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuariosRepository } from '../repositories/usuarios.repository';
import { CreateUsuarioDTO, LoginDTO, JwtPayload } from '../types/usuario.types';

const repository = new UsuariosRepository();
const SALT_ROUNDS = 10;

const generarToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] ?? '7d',
  });
};

export class UsuariosService {
  async registro(data: CreateUsuarioDTO) {
    if (!data.nombre?.trim())   throw new Error('El nombre es requerido');
    if (!data.apellido?.trim()) throw new Error('El apellido es requerido');
    if (!data.email?.trim())    throw new Error('El email es requerido');
    if (!data.password)         throw new Error('La contraseña es requerida');
    if (data.password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');

    const existente = await repository.findByEmail(data.email.toLowerCase());
    if (existente) throw new Error('El email ya está registrado');

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const id = await repository.create({
      nombre:   data.nombre.trim(),
      apellido: data.apellido.trim(),
      email:    data.email.toLowerCase(),
      password_hash,
      telefono: data.telefono?.trim(),
    });

    const usuario = await repository.findById(id);
    const token = generarToken({ id, email: data.email.toLowerCase(), tipo: 'usuario' });

    return { usuario, token };
  }

  async login(data: LoginDTO) {
    if (!data.email || !data.password) throw new Error('Email y contraseña son requeridos');

    const usuario = await repository.findByEmail(data.email.toLowerCase());
    if (!usuario) throw new Error('Credenciales inválidas');
    if (!usuario.activo) throw new Error('La cuenta está desactivada');

    const passwordValida = await bcrypt.compare(data.password, usuario.password_hash);
    if (!passwordValida) throw new Error('Credenciales inválidas');

    const { password_hash, ...usuarioSinPassword } = usuario;
    const token = generarToken({ id: usuario.id, email: usuario.email, tipo: 'usuario' });

    return { usuario: usuarioSinPassword, token };
  }

  async getPerfil(id: number) {
    const usuario = await repository.findById(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }
}
