import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import Administrador from '../models/admin.model.js';
import Aluno from '../models/aluno.model.js';
import ApiError from '../utils/ApiError.js';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_ISSUER, JWT_AUDIENCE } from '../config/jwt.js';
import { normalizeEmail, validatePassword, emailPattern } from '../utils/identityPolicy.js';

const dummyHash = bcrypt.hashSync(randomUUID(), 10);

function gerarToken(usuario) {
  return jwt.sign({ sub: usuario.id, role: usuario.role, nome: usuario.nome }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256', issuer: JWT_ISSUER, audience: JWT_AUDIENCE,
  });
}

export async function login(dados, protection) {
  let { email, senha } = dados ?? {};
  if (!email || !senha) {
    throw new ApiError(400, 'Os campos "email" e "senha" são obrigatórios.');
  }

  if (typeof email !== 'string' || typeof senha !== 'string') {
    throw new ApiError(400, 'Os campos "email" e "senha" devem ser strings.');
  }

  email = normalizeEmail(email);
  validatePassword(senha);
  const authenticate = async () => {
  const query = { email: emailPattern(email) };
  const admin = await Administrador.findOne(query);
  const aluno = await Aluno.findOne(query);
  const total = await Administrador.countDocuments(query) + await Aluno.countDocuments(query);
  const usuario = total === 1 ? (admin || aluno) : null;

  const valid = bcrypt.compareSync(senha, usuario?.senha || dummyHash);
  if (!usuario || !valid) {
    throw new ApiError(401, 'E-mail ou senha inválidos.');
  }

  return {
    token: gerarToken(usuario),
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email,
      role: usuario.role,
    },
  };
  };
  return protection ? protection.account(email, authenticate) : authenticate();
}

export default { login };
