import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import "dotenv/config";
import { comTokenDeAdmin } from "../helpers/auth.js";
import testesRemoveDisciplina from "../fixtures/disciplina.json" with { type: "json" };

describe("Cadastro de disciplina", () => {
  let idDisciplina = null;

  after(async () => {
    await mongoose.connection.close();
  });

  it("deve retornar 204 quando a disciplina é removida com sucesso", async () => {
    const removeDisciplinaSucesso = testesRemoveDisciplina.removeDisciplinaSucesso;

    const respostaCadastroDisciplina = await request(process.env.BASE_URL)
      .post("/api/admin/disciplinas")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(removeDisciplinaSucesso.dadosDisciplina);

    idDisciplina = respostaCadastroDisciplina.body.id;

    const removeDisciplinaCadastrada = await request(process.env.BASE_URL)
      .delete(`/api/admin/disciplinas/${idDisciplina}`)
      .set("Authorization", await comTokenDeAdmin());

    expect(removeDisciplinaCadastrada.status).to.equal(removeDisciplinaSucesso.esperado.statusCode);
  });


});
