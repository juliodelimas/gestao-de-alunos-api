import Nota from '../models/nota.model.js';
import ApiError from '../utils/ApiError.js';
import { buscarPorId as buscarAlunoPorId } from './alunos.service.js';
import { buscarPorId as buscarDisciplinaPorId, estaMatriculado } from './disciplinas.service.js';

export const TIPOS_VALIDOS = ['prova', 'trabalho', 'participacao'];

export async function listar({ alunoId, disciplinaId } = {}) {
  const filtro = {};
  if (alunoId) filtro.alunoId = alunoId;
  if (disciplinaId) filtro.disciplinaId = disciplinaId;
  return Nota.find(filtro);
}

export async function buscarPorId(id) {
  const nota = await Nota.findById(id);
  if (!nota) throw new ApiError(404, `Nota com id "${id}" não encontrada.`);
  return nota;
}

export async function criar(dados) {
  const { alunoId, disciplinaId, valor, tipo, descricao } = dados;

  if (!alunoId || !disciplinaId || valor === undefined || !tipo) {
    throw new ApiError(400, 'Os campos "alunoId", "disciplinaId", "valor" e "tipo" são obrigatórios.');
  }
  if (typeof valor !== 'number' || valor < 0 || valor > 10) {
    throw new ApiError(400, 'O campo "valor" deve ser um número entre 0 e 10.');
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw new ApiError(400, `O campo "tipo" deve ser um dos seguintes: ${TIPOS_VALIDOS.join(', ')}.`);
  }

  await buscarAlunoPorId(alunoId);
  await buscarDisciplinaPorId(disciplinaId);

  if (!(await estaMatriculado(alunoId, disciplinaId))) {
    throw new ApiError(409, 'O aluno não está matriculado nesta disciplina.');
  }

  const nota = new Nota({ alunoId, disciplinaId, valor, tipo, descricao });
  await nota.save();
  return nota;
}

export async function atualizar(id, dados) {
  const nota = await buscarPorId(id);
  const { valor, tipo, descricao } = dados;

  if (valor !== undefined && (typeof valor !== 'number' || valor < 0 || valor > 10)) {
    throw new ApiError(400, 'O campo "valor" deve ser um número entre 0 e 10.');
  }
  if (tipo !== undefined && !TIPOS_VALIDOS.includes(tipo)) {
    throw new ApiError(400, `O campo "tipo" deve ser um dos seguintes: ${TIPOS_VALIDOS.join(', ')}.`);
  }

  if (valor !== undefined) nota.valor = valor;
  if (tipo !== undefined) nota.tipo = tipo;
  if (descricao !== undefined) nota.descricao = descricao;
  await nota.save();
  return nota;
}

export async function remover(id) {
  await buscarPorId(id);
  await Nota.findByIdAndDelete(id);
}

export default { listar, buscarPorId, criar, atualizar, remover, TIPOS_VALIDOS };
