import { Router } from 'express';
import { listar, buscarPorId, corrigir, remover } from '../../controllers/trabalhos.controller.js';

const router = Router();

router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', corrigir);
router.delete('/:id', remover);

export default router;
