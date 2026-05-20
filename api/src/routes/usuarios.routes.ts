import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/usuario.types';

const router = Router();
const controller = new UsuariosController();

router.post('/registro', (req, res) => controller.registro(req as AuthRequest, res));
router.post('/login',    (req, res) => controller.login(req as AuthRequest, res));
router.get('/perfil', authMiddleware, (req, res) => controller.getPerfil(req as AuthRequest, res));

export default router;
