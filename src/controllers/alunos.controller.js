import asyncHandler from '../utils/asyncHandler.js';
import {
  listar as listarService,
  buscarPorId as buscarPorIdService,
  criar as criarService,
  atualizar as atualizarService,
  remover as removerService,
  listarDisciplinas as listarDisciplinasService,
  listarNotas as listarNotasService,
} from '../services/alunos.service.js';
import { sanitizeAluno } from '../models/aluno.model.js';

export const listar = asyncHandler(async (req, res) => {
  res.json(listarService().map(sanitizeAluno));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(sanitizeAluno(buscarPorIdService(req.params.id)));
});

export const criar = asyncHandler(async (req, res) => {
  const aluno = criarService(req.body);
  res.status(201).json(sanitizeAluno(aluno));
});

export const atualizar = asyncHandler(async (req, res) => {
  res.json(sanitizeAluno(atualizarService(req.params.id, req.body)));
});

export const remover = asyncHandler(async (req, res) => {
  removerService(req.params.id);
  res.status(204).send();
});

export const listarDisciplinas = asyncHandler(async (req, res) => {
  res.json(listarDisciplinasService(req.params.alunoId));
});

export const listarNotas = asyncHandler(async (req, res) => {
  res.json(listarNotasService(req.params.alunoId, req.query.disciplinaId));
});
