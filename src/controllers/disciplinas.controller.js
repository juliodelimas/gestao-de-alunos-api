import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {
  listar as listarService,
  buscarPorId as buscarPorIdService,
  criar as criarService,
  atualizar as atualizarService,
  remover as removerService,
  matricular as matricularService,
  listarAlunos as listarAlunosService,
} from '../services/disciplinas.service.js';
import { sanitizeAluno } from '../models/aluno.model.js';

export const listar = asyncHandler(async (req, res) => {
  res.json(await listarService());
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(await buscarPorIdService(req.params.id));
});

export const criar = asyncHandler(async (req, res) => {
  const disciplina = await criarService(req.body);
  res.status(201).json(disciplina);
});

export const atualizar = asyncHandler(async (req, res) => {
  res.json(await atualizarService(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  await removerService(req.params.id);
  res.status(204).send();
});

export const matricular = asyncHandler(async (req, res) => {
  const { alunoId } = req.body;
  if (!alunoId) {
    throw new ApiError(400, 'O campo "alunoId" é obrigatório.');
  }
  const matricula = await matricularService(req.params.id, alunoId);
  res.status(201).json(matricula);
});

export const listarAlunos = asyncHandler(async (req, res) => {
  res.json((await listarAlunosService(req.params.id)).map(sanitizeAluno));
});
