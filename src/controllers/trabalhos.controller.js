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
  res.json(await listarService({ alunoId, disciplinaId, status }));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(await buscarPorIdService(req.params.id));
});

export const corrigir = asyncHandler(async (req, res) => {
  res.json(await corrigirService(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  await removerService(req.params.id);
  res.status(204).send();
});

export const registrar = asyncHandler(async (req, res) => {
  const trabalho = await registrarService(req.params.alunoId, req.body);
  res.status(201).json(trabalho);
});

export const listarPorAluno = asyncHandler(async (req, res) => {
  res.json(await listarService({ alunoId: req.params.alunoId }));
});
