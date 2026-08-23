import asyncHandler from '../utils/asyncHandler.js';
import {
  listar as listarService,
  buscarPorId as buscarPorIdService,
  corrigir as corrigirService,
  remover as removerService,
  registrar as registrarService,
} from '../services/trabalhos.service.js';

export const listar = asyncHandler(async (req, res) => {
  const { alunoId, disciplinaId, status } = req.query;
  res.json(listarService({ alunoId, disciplinaId, status }));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(buscarPorIdService(req.params.id));
});

export const corrigir = asyncHandler(async (req, res) => {
  res.json(corrigirService(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  removerService(req.params.id);
  res.status(204).send();
});

export const registrar = asyncHandler(async (req, res) => {
  const trabalho = registrarService(req.params.alunoId, req.body);
  res.status(201).json(trabalho);
});

export const listarPorAluno = asyncHandler(async (req, res) => {
  res.json(listarService({ alunoId: req.params.alunoId }));
});
