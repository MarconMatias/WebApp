import { Response } from 'express';
import { EnviosService } from '../services/envios.service';
import { AuthRequest } from '../types/usuario.types';

const service = new EnviosService();

export class EnviosController {
  async getByPedido(req: AuthRequest, res: Response): Promise<void> {
    try {
      const envio = await service.getByPedido(Number(req.params.pedido_id), req.usuario!);
      res.json(envio);
    } catch (error: any) {
      if (error.message === 'Pedido no encontrado')                    { res.status(404).json({ message: error.message }); return; }
      if (error.message === 'Sin acceso a este pedido')                { res.status(403).json({ message: error.message }); return; }
      if (error.message === 'El pedido aún no tiene envío registrado') { res.status(404).json({ message: error.message }); return; }
      res.status(500).json({ message: 'Error al obtener envío' });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const envio = await service.create(req.body);
      res.status(201).json(envio);
    } catch (error: any) {
      const status = error.message === 'Pedido no encontrado' ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const envio = await service.update(Number(req.params.id), req.body);
      res.json(envio);
    } catch (error: any) {
      const status = error.message === 'Envío no encontrado' ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  }
}
