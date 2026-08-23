import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Administrador from '../models/admin.model.js';
import Aluno from '../models/aluno.model.js';
import ApiError from '../utils/ApiError.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

function gerarToken(usuario) {
  return jwt.sign({ sub: usuario.id, role: usuario.role, nome: usuario.nome }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export async function login({ email, senha }) {
  if (!email || !senha) {
    throw new ApiError(400, 'Os campos "email" e "senha" são obrigatórios.');
  }

  const admin = await Administrador.findOne({ email });
  const aluno = admin ? null : await Aluno.findOne({ email });
  const usuario = admin || aluno;

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    throw new ApiError(401, 'E-mail ou senha inválidos.');
  }

  return {
    token: gerarToken(usuario),
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  };
}

export default { login };
