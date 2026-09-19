import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { JWT_SECRET } from '../config/env.js';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Token de autenticação não informado.'));
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role, nome: payload.nome };
    next();
  } catch (err) {
    next(new ApiError(401, 'Token de autenticação inválido ou expirado.'));
  }
}

export default authenticate;
