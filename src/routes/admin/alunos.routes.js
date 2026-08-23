import { Router } from 'express';
import { listar, criar, buscarPorId, atualizar, remover } from '../../controllers/alunos.controller.js';

const router = Router();

router.get('/', listar);
router.post('/', criar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', remover);

export default router;
