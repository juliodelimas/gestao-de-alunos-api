import Disciplina from '../models/disciplina.model.js';
import Matricula from '../models/matricula.model.js';
import Aluno from '../models/aluno.model.js';
import ApiError from '../utils/ApiError.js';
import { buscarPorId as buscarAlunoPorId } from './alunos.service.js';

export async function listar() {
  return Disciplina.find();
}

export async function buscarPorId(id) {
  const disciplina = await Disciplina.findById(id);
  if (!disciplina) throw new ApiError(404, `Disciplina com id "${id}" não encontrada.`);
  return disciplina;
}

export async function criar(dados) {
  const { nome, codigo, cargaHoraria } = dados;
  if (!nome || !codigo) {
    throw new ApiError(400, 'Os campos "nome" e "codigo" são obrigatórios.');
  }

  const jaExiste = await Disciplina.exists({ codigo });
  if (jaExiste) {
    throw new ApiError(409, `Já existe uma disciplina com o código "${codigo}".`);
  }

  const disciplina = new Disciplina({ nome, codigo, cargaHoraria });
  await disciplina.save();
  return disciplina;
}

export async function atualizar(id, dados) {
  const disciplina = await buscarPorId(id);
  const { nome, codigo, cargaHoraria } = dados;
  if (nome !== undefined) disciplina.nome = nome;
  if (codigo !== undefined) disciplina.codigo = codigo;
  if (cargaHoraria !== undefined) disciplina.cargaHoraria = cargaHoraria;
  await disciplina.save();
  return disciplina;
}

export async function remover(id) {
  await buscarPorId(id);
  await Disciplina.findByIdAndDelete(id);
}

export async function matricular(disciplinaId, alunoId) {
  await buscarPorId(disciplinaId);
  await buscarAlunoPorId(alunoId);

  const jaMatriculado = await Matricula.exists({ alunoId, disciplinaId });
  if (jaMatriculado) {
    throw new ApiError(409, 'Aluno já está matriculado nesta disciplina.');
  }

  const matricula = new Matricula({ alunoId, disciplinaId });
  await matricula.save();
  return matricula;
}

export async function listarAlunos(disciplinaId) {
  await buscarPorId(disciplinaId);
  const matriculas = await Matricula.find({ disciplinaId });
  const alunoIds = matriculas.map((m) => m.alunoId);
  return Aluno.find({ _id: { $in: alunoIds } });
}

export async function estaMatriculado(alunoId, disciplinaId) {
  return Boolean(await Matricula.exists({ alunoId, disciplinaId }));
}

export default { listar, buscarPorId, criar, atualizar, remover, matricular, listarAlunos, estaMatriculado };
