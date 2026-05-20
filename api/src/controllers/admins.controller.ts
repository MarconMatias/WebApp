import { Request, Response } from 'express';
import { AdminsService } from '../services/admins.service';

const service = new AdminsService();

export class AdminsController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await service.login(req.body);
      res.json(resultado);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
