import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import "dotenv/config";
import { comTokenDeAdmin } from "../helpers/auth.js";
import testesCadastroDisciplina from "../fixtures/disciplina.json" with { type: "json" };

describe("Cadastro de disciplina", () => {
  let idDisciplina = null;

  afterEach(async () => {
    if (!idDisciplina) {
      return; //Não houve aluno cadastrado para remover.
    }

    const removeDisciplinaCadastrada = await request(process.env.BASE_URL)
      .delete(`/api/admin/disciplinas/${idDisciplina}`)
      .set("Authorization", await comTokenDeAdmin());

    console.log("Status da exclusão do aluno:", removeDisciplinaCadastrada.status);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("deve retornar 201 quando a disciplina é cadastrada com sucesso", async () => {
    const cadastroDisciplinaSucesso = testesCadastroDisciplina.cadastroDisciplinaSucesso;

    const resposta = await request(process.env.BASE_URL)
      .post("/api/admin/disciplinas")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(cadastroDisciplinaSucesso.dadosDisciplina);

    idDisciplina = resposta.body.id;

    expect(resposta.status).to.equal(cadastroDisciplinaSucesso.esperado.statusCode);
    expect(resposta.body.nome).to.equal(cadastroDisciplinaSucesso.dadosDisciplina.nome);
    expect(resposta.body.codigo).to.equal(cadastroDisciplinaSucesso.dadosDisciplina.codigo);
    expect(resposta.body.cargaHoraria).to.equal(cadastroDisciplinaSucesso.dadosDisciplina.cargaHoraria);
  });

  it("deve retornar 400 quando cadastrada sem nome", async () => {
    const cadastroDisciplinaErro = testesCadastroDisciplina.cadastroDisciplinaErro;

    const resposta = await request(process.env.BASE_URL)
      .post("/api/admin/disciplinas")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(cadastroDisciplinaErro.dadosDisciplinaErro);

    expect(resposta.status).to.equal(cadastroDisciplinaErro.esperado.statusCode);
    expect(resposta.body.error).to.equal(cadastroDisciplinaErro.esperado.error);
  });

});
