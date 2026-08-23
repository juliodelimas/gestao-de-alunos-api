import { Router } from 'express';
import { listarDisciplinas, listarNotas } from '../controllers/alunos.controller.js';
import { listarPorAluno, registrar } from '../controllers/trabalhos.controller.js';
import authenticate from '../middlewares/authenticate.js';
import authorizeSelfOrAdmin from '../middlewares/authorizeSelfOrAdmin.js';

const router = Router();

// Autoatendimento: exige um usuário autenticado, que seja o próprio aluno ou um admin.
router.use(authenticate);

router.get('/:alunoId/disciplinas', authorizeSelfOrAdmin, listarDisciplinas);
router.get('/:alunoId/notas', authorizeSelfOrAdmin, listarNotas);
router.get('/:alunoId/trabalhos', authorizeSelfOrAdmin, listarPorAluno);
router.post('/:alunoId/trabalhos', authorizeSelfOrAdmin, registrar);

export default router;
