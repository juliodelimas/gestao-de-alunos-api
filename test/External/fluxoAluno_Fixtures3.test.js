import mongoose from 'mongoose';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { seed } from '../../src/database/seed.js';
import { criarAluno } from '../helpers/aluno.helper.js';
import { criarDisciplina, matricularAlunoDisciplina } from '../helpers/disciplina.helper.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json' };

describe('Fluxo do Aluno utilizando Fixtures 3 - usando identificação do aluno para realizar cada teste', () => {
  after(async () => { 
    await mongoose.connection.close(); 
  });

  before(async () => {
    await mongoose.connection.dropDatabase(); // limpa tudo
    await seed(); // recria dados default
  });

  const testesDeMatricula = testesDeMatriculas.find(tdm => tdm.dadosAluno.matricula == 'F19800518')

  it.only(testesDeMatricula.testTitle, async () => {
    //Cadastrar um aluno
    const cadastroAlunoResposta = await criarAluno(testesDeMatricula.dadosAluno);

    //Cadastrar uma Disciplina
    const cadastroDisciplinaResposta = await criarDisciplina(testesDeMatricula.dadosDisciplina);

    //Matricular um Aluno na Disciplina e validar que ele foi matriculado
    const idAluno = cadastroAlunoResposta.body.id;
    const idDisciplina = cadastroDisciplinaResposta.body.id;

    const matricularResposta = await matricularAlunoDisciplina(idDisciplina, idAluno);
    expect(matricularResposta.status).to.equal(testesDeMatricula.statusCodeEsperado);
    expect(matricularResposta.body.alunoId).to.equal(idAluno);
    expect(matricularResposta.body.disciplinaId).to.equal(idDisciplina);

  });

  const testesDeMatricula2 = testesDeMatriculas.find(tdm => tdm.dadosAluno.matricula == 'M19800518');
  it.only(testesDeMatricula2.testTitle, async () => {
    //Cadastrar um aluno
    const cadastroAlunoResposta = await criarAluno(testesDeMatricula2.dadosAluno);

    //Cadastrar uma Disciplina
    const cadastroDisciplinaResposta = await criarDisciplina(testesDeMatricula2.dadosDisciplina);

    //Matricular um Aluno na Disciplina e validar que ele foi matriculado
    const idAluno = cadastroAlunoResposta.body.id;
    const idDisciplina = cadastroDisciplinaResposta.body.id;
    const matricularResposta = await matricularAlunoDisciplina(idDisciplina, idAluno);
    expect(matricularResposta.status).to.equal(testesDeMatricula2.statusCodeEsperado);
    expect(matricularResposta.body.alunoId).to.equal(idAluno);
    expect(matricularResposta.body.disciplinaId).to.equal(idDisciplina);

  });

});