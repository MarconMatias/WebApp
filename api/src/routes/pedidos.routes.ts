import { Router } from 'express';
import { PedidosController } from '../controllers/pedidos.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/usuario.types';

const router = Router();
const controller = new PedidosController();

router.get('/',    authMiddleware, (req, res) => controller.getAll(req as AuthRequest, res));
router.get('/:id', authMiddleware, (req, res) => controller.getById(req as AuthRequest, res));
router.post('/',   authMiddleware, (req, res) => controller.create(req as AuthRequest, res));
router.put('/:id/estado', authMiddleware, adminMiddleware, (req, res) => controller.updateEstado(req as AuthRequest, res));

export default router;
