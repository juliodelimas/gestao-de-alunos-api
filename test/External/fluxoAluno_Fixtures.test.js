import mongoose from 'mongoose';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { seed } from '../../src/database/seed.js';
import { criarAluno } from '../helpers/aluno.helper.js'
import { criarDisciplina, matricularAlunoDisciplina } from '../helpers/disciplina.helper.js'
import { cadastrarNota } from '../helpers/notas.helper.js'

//const loginData = JSON.parse(readFileSync('./test/fixtures/login.json', 'utf-8'));
const alunoData = JSON.parse(readFileSync('./test/fixtures/aluno.json', 'utf-8'));
const disciplinaData = JSON.parse(readFileSync('./test/fixtures/disciplina.json', 'utf-8'));

describe('Fluxo do Aluno utilizando Fixtures', () => {
  after(async () => { 
    await mongoose.connection.close(); 
  });

  before(async () => {
    await mongoose.connection.dropDatabase(); // limpa tudo
    await seed(); // recria dados default
  });

  //let token;
  //beforeEach(async () => {
  //  token = await gerarToken(loginData.admin);
  //})

  it('Cadastrar um aluno, cadastrar uma disciplina e matricular o aluno', async () => {
    //Cadastrar um aluno
    const cadastroAlunoResposta = await criarAluno(alunoData.fabiomsouza);

    //Cadastrar uma Disciplina
    const cadastroDisciplinaResposta = await criarDisciplina(disciplinaData.Química);

    //Matricular um Aluno na Disciplina e validar que ele foi matriculado
    const idAluno = cadastroAlunoResposta.body.id;
    const idDisciplina = cadastroDisciplinaResposta.body.id;

    const matricularResposta = await matricularAlunoDisciplina(idDisciplina, idAluno);
    expect(matricularResposta.status).to.equal(201);
    expect(matricularResposta.body.alunoId).to.equal(idAluno);
    expect(matricularResposta.body.disciplinaId).to.equal(idDisciplina);

    //Cadastrar nota e validar
    const dadosNota= {
      "alunoId": `${idAluno}`,
      "disciplinaId": `${idDisciplina}`,
      "valor": 10,
      "tipo": "prova",
      "descricao": "Prova 1 - Química"
    }

    const cadastroNotasResposta = await cadastrarNota(dadosNota);
    expect(cadastroNotasResposta.status).to.equal(201);
    expect(cadastroNotasResposta.body.alunoId).to.equal(dadosNota.alunoId);
    expect(cadastroNotasResposta.body.disciplinaId).to.equal(dadosNota.disciplinaId);
    expect(cadastroNotasResposta.body.valor).to.equal(dadosNota.valor);
    expect(cadastroNotasResposta.body.tipo).to.equal(dadosNota.tipo);
    expect(cadastroNotasResposta.body.descricao).to.equal(dadosNota.descricao);

  });

});