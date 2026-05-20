import { Router } from 'express';
import { CategoriasController } from '../controllers/categorias.controller';

const router = Router();
const controller = new CategoriasController();

// Publico
router.get('/',     (_req, res) => controller.getAll(_req, res));
router.get('/:id',  (req, res)  => controller.getById(req, res));

// Admin
router.post('/',    (req, res) => controller.create(req, res));
router.put('/:id',  (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
