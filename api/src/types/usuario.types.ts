import { Request } from 'express';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  activo: boolean;
  created_at: Date;
}

export interface CreateUsuarioDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  tipo: 'usuario' | 'admin';
}

export interface AuthRequest extends Request {
  usuario?: JwtPayload;
}
