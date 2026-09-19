import { randomUUID } from 'node:crypto';

// O banco persiste entre execuções e a API rejeita e-mail/matrícula repetidos com 409, então a
// massa em JSON guarda só a base de cada um e o sufixo único entra aqui.
export function comDadosUnicos(aluno) {
  const sufixo = randomUUID().slice(0, 8);

  return {
    nome: aluno.nome,
    email: `${aluno.emailBase}+${sufixo}@example.com`,
    matricula: `${aluno.matriculaBase}-${sufixo}`,
    senha: aluno.senha,
  };
}

export default { comDadosUnicos };
