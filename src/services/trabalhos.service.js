import db from '../database/db.js';
import { createTrabalho } from '../models/trabalho.model.js';
import ApiError from '../utils/ApiError.js';
import * as alunosService from './alunos.service.js';
import * as disciplinasService from './disciplinas.service.js';

export const STATUS_VALIDOS = ['entregue', 'em_correcao', 'corrigido'];

export function listar({ alunoId, disciplinaId, status } = {}) {
  return db
    .all('trabalhos')
    .filter(
      (t) =>
        (!alunoId || t.alunoId === alunoId) &&
        (!disciplinaId || t.disciplinaId === disciplinaId) &&
        (!status || t.status === status),
    );
}

export function buscarPorId(id) {
  const trabalho = db.findById('trabalhos', id);
  if (!trabalho) throw new ApiError(404, `Trabalho com id "${id}" não encontrado.`);
  return trabalho;
}

export function registrar(alunoId, dados) {
  alunosService.buscarPorId(alunoId);

  const { disciplinaId, titulo, descricao } = dados;
  if (!disciplinaId || !titulo) {
    throw new ApiError(400, 'Os campos "disciplinaId" e "titulo" são obrigatórios.');
  }

  disciplinasService.buscarPorId(disciplinaId);

  if (!disciplinasService.estaMatriculado(alunoId, disciplinaId)) {
    throw new ApiError(409, 'O aluno não está matriculado nesta disciplina.');
  }

  const trabalho = createTrabalho({ alunoId, disciplinaId, titulo, descricao });
  db.insert('trabalhos', trabalho);
  return trabalho;
}

export function corrigir(id, dados) {
  buscarPorId(id);
  const { status, nota, feedback } = dados;

  if (status !== undefined && !STATUS_VALIDOS.includes(status)) {
    throw new ApiError(
      400,
      `O campo "status" deve ser um dos seguintes: ${STATUS_VALIDOS.join(', ')}.`,
    );
  }
  if (nota !== undefined && nota !== null && (typeof nota !== 'number' || nota < 0 || nota > 10)) {
    throw new ApiError(400, 'O campo "nota" deve ser um número entre 0 e 10.');
  }

  return db.update('trabalhos', id, {
    ...(status !== undefined && { status }),
    ...(nota !== undefined && { nota }),
    ...(feedback !== undefined && { feedback }),
  });
}

export function remover(id) {
  buscarPorId(id);
  db.remove('trabalhos', id);
}

export default { listar, buscarPorId, registrar, corrigir, remover, STATUS_VALIDOS };
