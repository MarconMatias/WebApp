import { Router } from 'express';
import { AdminsController } from '../controllers/admins.controller';

const router = Router();
const controller = new AdminsController();

router.post('/login', (req, res) => controller.login(req, res));

export default router;
