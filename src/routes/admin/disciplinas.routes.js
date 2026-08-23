import { Router } from 'express';
import {
  listar,
  criar,
  buscarPorId,
  atualizar,
  remover,
  matricular,
  listarAlunos,
} from '../../controllers/disciplinas.controller.js';

const router = Router();

router.get('/', listar);
router.post('/', criar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', remover);
router.post('/:id/matriculas', matricular);
router.get('/:id/alunos', listarAlunos);

export default router;
