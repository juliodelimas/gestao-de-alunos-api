import db from '../database/db.js';
import { createNota } from '../models/nota.model.js';
import ApiError from '../utils/ApiError.js';
import * as alunosService from './alunos.service.js';
import * as disciplinasService from './disciplinas.service.js';

export const TIPOS_VALIDOS = ['prova', 'trabalho', 'participacao'];

export function listar({ alunoId, disciplinaId } = {}) {
  return db
    .all('notas')
    .filter(
      (n) =>
        (!alunoId || n.alunoId === alunoId) && (!disciplinaId || n.disciplinaId === disciplinaId),
    );
}

export function buscarPorId(id) {
  const nota = db.findById('notas', id);
  if (!nota) throw new ApiError(404, `Nota com id "${id}" não encontrada.`);
  return nota;
}

export function criar(dados) {
  const { alunoId, disciplinaId, valor, tipo, descricao } = dados;

  if (!alunoId || !disciplinaId || valor === undefined || !tipo) {
    throw new ApiError(
      400,
      'Os campos "alunoId", "disciplinaId", "valor" e "tipo" são obrigatórios.',
    );
  }
  if (typeof valor !== 'number' || valor < 0 || valor > 10) {
    throw new ApiError(400, 'O campo "valor" deve ser um número entre 0 e 10.');
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw new ApiError(
      400,
      `O campo "tipo" deve ser um dos seguintes: ${TIPOS_VALIDOS.join(', ')}.`,
    );
  }

  alunosService.buscarPorId(alunoId);
  disciplinasService.buscarPorId(disciplinaId);

  if (!disciplinasService.estaMatriculado(alunoId, disciplinaId)) {
    throw new ApiError(409, 'O aluno não está matriculado nesta disciplina.');
  }

  const nota = createNota({ alunoId, disciplinaId, valor, tipo, descricao });
  db.insert('notas', nota);
  return nota;
}

export function atualizar(id, dados) {
  buscarPorId(id);
  const { valor, tipo, descricao } = dados;

  if (valor !== undefined && (typeof valor !== 'number' || valor < 0 || valor > 10)) {
    throw new ApiError(400, 'O campo "valor" deve ser um número entre 0 e 10.');
  }
  if (tipo !== undefined && !TIPOS_VALIDOS.includes(tipo)) {
    throw new ApiError(
      400,
      `O campo "tipo" deve ser um dos seguintes: ${TIPOS_VALIDOS.join(', ')}.`,
    );
  }

  return db.update('notas', id, {
    ...(valor !== undefined && { valor }),
    ...(tipo !== undefined && { tipo }),
    ...(descricao !== undefined && { descricao }),
  });
}

export function remover(id) {
  buscarPorId(id);
  db.remove('notas', id);
}

export default { listar, buscarPorId, criar, atualizar, remover, TIPOS_VALIDOS };
