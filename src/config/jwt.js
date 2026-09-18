if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET deve ser definido. Consulte .env.example.');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = '8h';
export const JWT_ISSUER = 'gestao-de-alunos-api';
export const JWT_AUDIENCE = 'gestao-de-alunos-client';
