import db from '../database/db.js';
import { createDisciplina } from '../models/disciplina.model.js';
import { createMatricula } from '../models/matricula.model.js';
import ApiError from '../utils/ApiError.js';
import { buscarPorId as buscarAlunoPorId } from './alunos.service.js';

export function listar() {
  return db.all('disciplinas');
}

export function buscarPorId(id) {
  const disciplina = db.findById('disciplinas', id);
  if (!disciplina) throw new ApiError(404, `Disciplina com id "${id}" não encontrada.`);
  return disciplina;
}

export function criar(dados) {
  const { nome, codigo, cargaHoraria } = dados;
  if (!nome || !codigo) {
    throw new ApiError(400, 'Os campos "nome" e "codigo" são obrigatórios.');
  }

  const jaExiste = db.all('disciplinas').some((d) => d.codigo === codigo);
  if (jaExiste) {
    throw new ApiError(409, `Já existe uma disciplina com o código "${codigo}".`);
  }

  const disciplina = createDisciplina({ nome, codigo, cargaHoraria });
  db.insert('disciplinas', disciplina);
  return disciplina;
}

export function atualizar(id, dados) {
  buscarPorId(id);
  const { nome, codigo, cargaHoraria } = dados;
  return db.update('disciplinas', id, {
    ...(nome !== undefined && { nome }),
    ...(codigo !== undefined && { codigo }),
    ...(cargaHoraria !== undefined && { cargaHoraria }),
  });
}

export function remover(id) {
  buscarPorId(id);
  db.remove('disciplinas', id);
}

export function matricular(disciplinaId, alunoId) {
  buscarPorId(disciplinaId);
  buscarAlunoPorId(alunoId);

  const jaMatriculado = db
    .all('matriculas')
    .some((m) => m.alunoId === alunoId && m.disciplinaId === disciplinaId);
  if (jaMatriculado) {
    throw new ApiError(409, 'Aluno já está matriculado nesta disciplina.');
  }

  const matricula = createMatricula({ alunoId, disciplinaId });
  db.insert('matriculas', matricula);
  return matricula;
}

export function listarAlunos(disciplinaId) {
  buscarPorId(disciplinaId);
  const alunos = db.all('alunos');
  return db
    .all('matriculas')
    .filter((m) => m.disciplinaId === disciplinaId)
    .map((m) => alunos.find((a) => a.id === m.alunoId))
    .filter(Boolean);
}

export function estaMatriculado(alunoId, disciplinaId) {
  return db.all('matriculas').some((m) => m.alunoId === alunoId && m.disciplinaId === disciplinaId);
}

export default { listar, buscarPorId, criar, atualizar, remover, matricular, listarAlunos, estaMatriculado };
