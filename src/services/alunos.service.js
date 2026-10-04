import bcrypt from 'bcrypt';
import db from '../database/db.js';
import { createAluno } from '../models/aluno.model.js';
import ApiError from '../utils/ApiError.js';

export async function listar() {
  return Aluno.find();
}

export async function buscarPorId(id) {
  const aluno = await Aluno.findById(id);
  if (!aluno) throw new ApiError(404, `Aluno com id "${id}" não encontrado.`);
  return aluno;
}

function existeConflito({ matricula, email }) {
  return db.all('alunos').some((a) => a.matricula === matricula || a.email === email);
}

export async function criar(dados) {
  const { nome, email, matricula, senha } = dados;
  if (!nome || !email || !matricula || !senha) {
    throw new ApiError(400, 'Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');
  }

  const mensagemConflito = 'Já existe um aluno cadastrado com essa matrícula ou e-mail.';
  if (existeConflito({ matricula, email })) throw new ApiError(409, mensagemConflito);

  const aluno = await createAluno({ nome, email, matricula, senha });

  // O hash é assíncrono: outra requisição pode ter cadastrado o mesmo aluno enquanto esperávamos.
  if (existeConflito({ matricula, email })) throw new ApiError(409, mensagemConflito);
  db.insert('alunos', aluno);
  return aluno;
}

export async function atualizar(id, dados) {
  buscarPorId(id);
  const { nome, email, matricula, senha } = dados;
  const senhaHash = senha !== undefined ? await bcrypt.hash(senha, 10) : undefined;
  return db.update('alunos', id, {
    ...(nome !== undefined && { nome }),
    ...(email !== undefined && { email }),
    ...(matricula !== undefined && { matricula }),
    ...(senha !== undefined && { senha: senhaHash }),
  });
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
