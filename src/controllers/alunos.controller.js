import asyncHandler from '../utils/asyncHandler.js';
import alunosService from '../services/alunos.service.js';
import { sanitizeAluno } from '../models/aluno.model.js';

export const listar = asyncHandler(async (req, res) => {
  res.json(alunosService.listar().map(sanitizeAluno));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(sanitizeAluno(alunosService.buscarPorId(req.params.id)));
});

export const criar = asyncHandler(async (req, res) => {
  const aluno = alunosService.criar(req.body);
  res.status(201).json(sanitizeAluno(aluno));
});

export const atualizar = asyncHandler(async (req, res) => {
  res.json(sanitizeAluno(alunosService.atualizar(req.params.id, req.body)));
});

export const remover = asyncHandler(async (req, res) => {
  alunosService.remover(req.params.id);
  res.status(204).send();
});

export const listarDisciplinas = asyncHandler(async (req, res) => {
  res.json(alunosService.listarDisciplinas(req.params.alunoId));
});

export const listarNotas = asyncHandler(async (req, res) => {
  res.json(alunosService.listarNotas(req.params.alunoId, req.query.disciplinaId));
});
