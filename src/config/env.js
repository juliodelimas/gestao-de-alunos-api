import 'dotenv/config';

// Onde não existe .env (GitHub Actions, por exemplo), o dotenv não faz nada e valem as
// variáveis já definidas no ambiente.
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = Number(process.env.PORT) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestao-de-alunos';
export const JWT_SECRET = process.env.JWT_SECRET || 'segredo-dev-gestao-de-alunos';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export default { NODE_ENV, PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN };
