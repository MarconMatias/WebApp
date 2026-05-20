import { Response } from 'express';
import { UsuariosService } from '../services/usuarios.service';
import { AuthRequest } from '../types/usuario.types';

const service = new UsuariosService();

export class UsuariosController {
  async registro(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resultado = await service.registro(req.body);
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resultado = await service.login(req.body);
      res.json(resultado);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getPerfil(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuario = await service.getPerfil(req.usuario!.id);
      res.json(usuario);
    } catch (error: any) {
      const status = error.message === 'Usuario no encontrado' ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }
}
