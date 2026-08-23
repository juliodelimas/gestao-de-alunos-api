import asyncHandler from '../utils/asyncHandler.js';
import {
  listar as listarService,
  buscarPorId as buscarPorIdService,
  criar as criarService,
  atualizar as atualizarService,
  remover as removerService,
} from '../services/notas.service.js';

export const listar = asyncHandler(async (req, res) => {
  const { alunoId, disciplinaId } = req.query;
  res.json(listarService({ alunoId, disciplinaId }));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(buscarPorIdService(req.params.id));
});

export const criar = asyncHandler(async (req, res) => {
  const nota = criarService(req.body);
  res.status(201).json(nota);
});

export const atualizar = asyncHandler(async (req, res) => {
  res.json(atualizarService(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  removerService(req.params.id);
  res.status(204).send();
});
