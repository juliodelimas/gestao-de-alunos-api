import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import "dotenv/config";
import { comTokenDeAdmin } from "../helpers/auth.js";
import testesCadastroAluno from "../fixtures/alunos.json" with { type: "json" };

describe("Cadastro de alunos", () => {
  let idAluno = null;

  afterEach(async () => {
    if (!idAluno) {
      return; //Não houve aluno cadastrado para remover.
    }

    const removeAlunoCadastrado = await request(process.env.BASE_URL)
      .delete(`/api/admin/alunos/${idAluno}`)
      .set("Authorization", await comTokenDeAdmin());

    console.log("Status da exclusão do aluno:", removeAlunoCadastrado.status);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("deve retornar 201 quando o aluno é cadastrado com sucesso", async () => {
    const cadastroAlunoSucesso = testesCadastroAluno.cadastroAlunoSucesso;

    const resposta = await request(process.env.BASE_URL)
      .post("/api/admin/alunos")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(cadastroAlunoSucesso.dados);

    idAluno = resposta.body.id;

    expect(resposta.status).to.equal(cadastroAlunoSucesso.esperado.statusCode);
    expect(resposta.body.nome).to.equal(cadastroAlunoSucesso.dados.nome);
    expect(resposta.body.email).to.equal(cadastroAlunoSucesso.dados.email);
    expect(resposta.body.matricula).to.equal(
      cadastroAlunoSucesso.dados.matricula,
    );
    expect(resposta.body.role).to.equal(cadastroAlunoSucesso.esperado.role);
  });

  it("deve retornar 400 quando cadastrar sem senha", async () => {
    const cadastroAlunoErro = testesCadastroAluno.cadastroAlunoErro;

    const resposta = await request(process.env.BASE_URL)
      .post("/api/admin/alunos")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(cadastroAlunoErro.dados);

    expect(resposta.status).to.equal(cadastroAlunoErro.esperado.statusCode);
    expect(resposta.body.error).to.equal(cadastroAlunoErro.esperado.error);
  });
});
