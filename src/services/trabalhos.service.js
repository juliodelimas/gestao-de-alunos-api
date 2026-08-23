import Trabalho from '../models/trabalho.model.js';
import ApiError from '../utils/ApiError.js';
import { buscarPorId as buscarAlunoPorId } from './alunos.service.js';
import { buscarPorId as buscarDisciplinaPorId, estaMatriculado } from './disciplinas.service.js';

export const STATUS_VALIDOS = ['entregue', 'em_correcao', 'corrigido'];

export async function listar({ alunoId, disciplinaId, status } = {}) {
  const filtro = {};
  if (alunoId) filtro.alunoId = alunoId;
  if (disciplinaId) filtro.disciplinaId = disciplinaId;
  if (status) filtro.status = status;
  return Trabalho.find(filtro);
}

export async function buscarPorId(id) {
  const trabalho = await Trabalho.findById(id);
  if (!trabalho) throw new ApiError(404, `Trabalho com id "${id}" não encontrado.`);
  return trabalho;
}

export async function registrar(alunoId, dados) {
  await buscarAlunoPorId(alunoId);

  const { disciplinaId, titulo, descricao } = dados;
  if (!disciplinaId || !titulo) {
    throw new ApiError(400, 'Os campos "disciplinaId" e "titulo" são obrigatórios.');
  }

  await buscarDisciplinaPorId(disciplinaId);

  if (!(await estaMatriculado(alunoId, disciplinaId))) {
    throw new ApiError(409, 'O aluno não está matriculado nesta disciplina.');
  }

  const trabalho = new Trabalho({ alunoId, disciplinaId, titulo, descricao });
  await trabalho.save();
  return trabalho;
}

export async function corrigir(id, dados) {
  const trabalho = await buscarPorId(id);
  const { status, nota, feedback } = dados;

  if (status !== undefined && !STATUS_VALIDOS.includes(status)) {
    throw new ApiError(400, `O campo "status" deve ser um dos seguintes: ${STATUS_VALIDOS.join(', ')}.`);
  }
  if (nota !== undefined && nota !== null && (typeof nota !== 'number' || nota < 0 || nota > 10)) {
    throw new ApiError(400, 'O campo "nota" deve ser um número entre 0 e 10.');
  }

  if (status !== undefined) trabalho.status = status;
  if (nota !== undefined) trabalho.nota = nota;
  if (feedback !== undefined) trabalho.feedback = feedback;
  await trabalho.save();
  return trabalho;
}

export async function remover(id) {
  await buscarPorId(id);
  await Trabalho.findByIdAndDelete(id);
}

export default { listar, buscarPorId, registrar, corrigir, remover, STATUS_VALIDOS };
