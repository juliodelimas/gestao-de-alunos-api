import { expect } from 'chai';
import { loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';

describe('Alunos', () => {

  let loginResponse;
  beforeEach(async () => {
    loginResponse = await loginUser('http://localhost:3000', 'admin@escola.com', 'admin123');
  });

  it('should sign up a new student', async () => {
    const aluno = alunosFixture.aleatorio;
    const alunoResponse = await createStudent('http://localhost:3000', aluno, loginResponse);

    expect(alunoResponse.status).to.equal(201);
    expect(alunoResponse.body).to.have.property('nome', 'Ana Souza');
    expect(alunoResponse.body).to.have.property('role', 'aluno');
  })

  it('should return 409 for duplicate student', async () => {
    const aluno = alunosFixture.alunoFixo
    const alunoResponse = await createStudent('http://localhost:3000', aluno, loginResponse);

    expect(alunoResponse.status).to.equal(409);
    expect(alunoResponse.body).to.have.property('error', 'Já existe um aluno cadastrado com essa matrícula ou e-mail.');
  })
});