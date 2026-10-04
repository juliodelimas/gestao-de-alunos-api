import { randomUUID } from 'node:crypto';

export function sanitizeAluno(aluno) {
  if (!aluno) return aluno;
  const plain = typeof aluno.toObject === 'function' ? aluno.toObject() : aluno;
  const { senha, ...resto } = plain;
  return resto;
}

export default Aluno;
