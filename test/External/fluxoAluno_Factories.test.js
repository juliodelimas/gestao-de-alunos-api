import mongoose from 'mongoose';
import { expect } from 'chai';
import { seed } from '../../src/database/seed.js';
import { criarAlunoFactory } from '../helpers/aluno.helper.js'; 
import { criarDisciplinaFactory, matricularAlunoDisciplina } from '../helpers/disciplina.helper.js'
import { cadastrarNota } from '../helpers/notas.helper.js'

describe('Fluxo do Aluno utilizando Factories', () => {
  after(async () => { 
    await mongoose.connection.close(); 
  });

  before(async () => {
    await mongoose.connection.dropDatabase(); // limpa tudo
    await seed(); // recria dados default
  });

  it('Cadastrar um aluno, cadastrar uma disciplina e matricular o aluno', async () => {
    //Cadastrar um aluno
    const cadastroAlunoResposta = await criarAlunoFactory();

    //Cadastrar uma Disciplina
    const cadastroDisciplinaResposta = await criarDisciplinaFactory();

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