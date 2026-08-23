import Aluno from '../models/aluno.model.js';
import Matricula from '../models/matricula.model.js';
import Disciplina from '../models/disciplina.model.js';
import Nota from '../models/nota.model.js';
import ApiError from '../utils/ApiError.js';

export async function listar() {
  return Aluno.find();
}

export async function buscarPorId(id) {
  const aluno = await Aluno.findById(id);
  if (!aluno) throw new ApiError(404, `Aluno com id "${id}" não encontrado.`);
  return aluno;
}

export async function criar(dados) {
  const { nome, email, matricula, senha } = dados;
  if (!nome || !email || !matricula || !senha) {
    throw new ApiError(400, 'Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');
  }

  const jaExiste = await Aluno.exists({ $or: [{ matricula }, { email }] });
  if (jaExiste) {
    throw new ApiError(409, 'Já existe um aluno cadastrado com essa matrícula ou e-mail.');
  }

  const aluno = new Aluno({ nome, email, matricula, senha });
  await aluno.save();
  return aluno;
}

export async function atualizar(id, dados) {
  const aluno = await buscarPorId(id);
  const { nome, email, matricula, senha } = dados;
  if (nome !== undefined) aluno.nome = nome;
  if (email !== undefined) aluno.email = email;
  if (matricula !== undefined) aluno.matricula = matricula;
  if (senha !== undefined) aluno.senha = senha;
  await aluno.save();
  return aluno;
}

export async function remover(id) {
  await buscarPorId(id);
  await Aluno.findByIdAndDelete(id);
}

export async function listarDisciplinas(alunoId) {
  await buscarPorId(alunoId);
  const matriculas = await Matricula.find({ alunoId });
  const disciplinaIds = matriculas.map((m) => m.disciplinaId);
  return Disciplina.find({ _id: { $in: disciplinaIds } });
}

export async function listarNotas(alunoId, disciplinaId) {
  await buscarPorId(alunoId);
  const filtro = { alunoId };
  if (disciplinaId) filtro.disciplinaId = disciplinaId;
  return Nota.find(filtro);
}

export default { listar, buscarPorId, criar, atualizar, remover, listarDisciplinas, listarNotas };
