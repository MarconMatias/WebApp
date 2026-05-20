import { Request, Response } from 'express';
import { CategoriasService } from '../services/categorias.service';

const service = new CategoriasService();

export class CategoriasController {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const categorias = await service.getAll();
      res.json(categorias);
    } catch {
      res.status(500).json({ message: 'Error al obtener categorías' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const categoria = await service.getById(Number(req.params.id));
      res.json(categoria);
    } catch (error: any) {
      const status = error.message === 'Categoría no encontrada' ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const categoria = await service.create(req.body);
      res.status(201).json(categoria);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const categoria = await service.update(Number(req.params.id), req.body);
      res.json(categoria);
    } catch (error: any) {
      const status = error.message === 'Categoría no encontrada' ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.message === 'Categoría no encontrada' ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }
}
