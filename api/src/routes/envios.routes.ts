import { Router } from 'express';
import { EnviosController } from '../controllers/envios.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/usuario.types';

const router = Router();
const controller = new EnviosController();

router.get('/pedido/:pedido_id', authMiddleware, (req, res) => controller.getByPedido(req as AuthRequest, res));
router.post('/',   authMiddleware, adminMiddleware, (req, res) => controller.create(req as AuthRequest, res));
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => controller.update(req as AuthRequest, res));

export default router;
