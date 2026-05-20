import { Request, Response } from 'express';
import { ProductosService } from '../services/productos.service';

const service = new ProductosService();

export class ProductosController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filtros = {
        categoria_id: req.query.categoria_id ? Number(req.query.categoria_id) : undefined,
      };
      const productos = await service.getAll(filtros);
      res.json(productos);
    } catch {
      res.status(500).json({ message: 'Error al obtener productos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const producto = await service.getById(Number(req.params.id));
      res.json(producto);
    } catch (error: any) {
      const status = error.message === 'Producto no encontrado' ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const producto = await service.create(req.body);
      res.status(201).json(producto);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const producto = await service.update(Number(req.params.id), req.body);
      res.json(producto);
    } catch (error: any) {
      const status = error.message === 'Producto no encontrado' ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error.message === 'Producto no encontrado' ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  }
}
