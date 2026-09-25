import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import "dotenv/config";
import { comTokenDeAdmin } from "../helpers/auth.js";
import testesEntregaTrabalhoAluno from "../fixtures/entregaTrabalho.json" with { type: "json" };

describe("Fluxo de entrega de um trabalho como aluno", () => {
    let idAluno = null;

    afterEach(async () => {
        if(!idAluno){
            return; //Não houve aluno cadastrado para remover.
        }

    const removeAlunoCadastrado = await request(process.env.BASE_URL)
        .delete(`/api/admin/alunos/${idAluno}`)        
        .set("Authorization", await comTokenDeAdmin());

        console.log('Status da exclusão:', removeAlunoCadastrado.status);
    });

    after(async () => {
        await mongoose.connection.close();
    });

    testesEntregaTrabalhoAluno.forEach((testeEntregaTrabalhoAluno) => {
        it("Validar que um aluno que acaba de ser cadastrado pode registrar a entrega de um trabalho", async () => {
        const cadastroAlunoResposta = await request(process.env.BASE_URL)
            .post("/api/admin/alunos")
            .set("Content-Type", "application/json")
            .set("Authorization", await comTokenDeAdmin())
            .send(testeEntregaTrabalhoAluno.dadosAluno);

        console.log("Aluno Cadastrado com Sucesso!")

        const matriculaAlunoResposta = await request(process.env.BASE_URL)
            .post(`/api/admin/disciplinas/${testeEntregaTrabalhoAluno.dadosDisciplina.id}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                "alunoId": `${idAluno}`
            });

        let idDisciplina = matriculaAlunoResposta.body.disciplinaId;
        
        console.log("Aluno matriculado com Sucesso!")

        const loginAlunoResposta = await request(process.env.BASE_URL)
            .post("/api/auth/login")
            .set("Content-Type", "application/json")
            .send({
                email: testeEntregaTrabalhoAluno.dadosAluno.email,
                senha: testeEntregaTrabalhoAluno.dadosAluno.senha,
            });

        let token = loginAlunoResposta.body.token;

        const registraTrabalhoResposta = await request(process.env.BASE_URL)
            .post(`/api/alunos/${idAluno}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "disciplinaId": `${idDisciplina}`,
                "titulo": testeEntregaTrabalhoAluno.dadosTrabalho.titulo,
                "descricao": testeEntregaTrabalhoAluno.dadosTrabalho.descricao
            });

        expect(registraTrabalhoResposta.status).to.equal(testeEntregaTrabalhoAluno.resposta.statusCodeEsperado);
        expect(registraTrabalhoResposta.body.alunoId).to.equal(`${idAluno}`);
        expect(registraTrabalhoResposta.body.disciplinaId).to.equal(`${idDisciplina}`);
        expect(registraTrabalhoResposta.body.titulo).to.equal(testeEntregaTrabalhoAluno.dadosTrabalho.titulo);
        expect(registraTrabalhoResposta.body.descricao).to.equal(testeEntregaTrabalhoAluno.dadosTrabalho.descricao);
        expect(registraTrabalhoResposta.body.status).to.equal(testeEntregaTrabalhoAluno.resposta.status);
        expect(registraTrabalhoResposta.body.nota).to.be.null;
        expect(registraTrabalhoResposta.body.feedback).to.be.null;
        });
    });
});
