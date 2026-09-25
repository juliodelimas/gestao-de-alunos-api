import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import "dotenv/config";
import { comTokenDeAdmin } from "../helpers/auth.js";
import testesRemoveAluno from "../fixtures/alunos.json" with { type: "json" };

describe("Remove aluno", () => {
  let idAluno = null;

  after(async () => {
    await mongoose.connection.close();
  });

  it("deve retornar 204 quando o aluno é removido com sucesso", async () => {
    const removeAlunoSucesso = testesRemoveAluno.removeAlunoSucesso;

    const respostaCadastroAluno = await request(process.env.BASE_URL)
      .post("/api/admin/alunos")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(removeAlunoSucesso.dados);

    idAluno = respostaCadastroAluno.body.id;

    const removeAlunoCadastrado = await request(process.env.BASE_URL)
      .delete(`/api/admin/alunos/${idAluno}`)
      .set("Authorization", await comTokenDeAdmin());

    expect(removeAlunoCadastrado.status).to.equal(removeAlunoSucesso.esperado.statusCode);
  });

});
