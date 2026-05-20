import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthRequest } from '../types/usuario.types';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token requerido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.usuario?.tipo !== 'admin') {
    res.status(403).json({ message: 'Acceso restringido a administradores' });
    return;
  }
  next();
};
