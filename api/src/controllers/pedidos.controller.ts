import { Response } from 'express';
import { PedidosService } from '../services/pedidos.service';
import { AuthRequest } from '../types/usuario.types';

const service = new PedidosService();

const NOT_FOUND  = 'Pedido no encontrado';
const SIN_ACCESO = 'Sin acceso a este pedido';

export class PedidosController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pedidos = await service.getAll(req.usuario!);
      res.json(pedidos);
    } catch {
      res.status(500).json({ message: 'Error al obtener pedidos' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pedido = await service.getById(Number(req.params.id), req.usuario!);
      res.json(pedido);
    } catch (error: any) {
      if (error.message === NOT_FOUND)  { res.status(404).json({ message: error.message }); return; }
      if (error.message === SIN_ACCESO) { res.status(403).json({ message: error.message }); return; }
      res.status(500).json({ message: 'Error al obtener pedido' });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pedido = await service.create(req.usuario!.id, req.body);
      res.status(201).json(pedido);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateEstado(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pedido = await service.updateEstado(Number(req.params.id), req.body);
      res.json(pedido);
    } catch (error: any) {
      const status = error.message === NOT_FOUND ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  }
}
