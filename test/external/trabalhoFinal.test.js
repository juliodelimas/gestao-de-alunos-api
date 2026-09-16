import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { comTokenDeAdmin, comTokenDeAluno } from '../helpers/auth.js';
import cenarios from '../fixtures/trabalhoFinal.json' assert { type: 'json' };

describe('Fluxo de entrega do trabalho final', () => {
	cenarios.forEach((cenario) => {
		it(cenario.testTitle, async () => {
			// Etapa 1: preparar dados exclusivos para o aluno do cenário passado.
			const identificador = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			const dadosAluno = {
				nome: cenario.aluno.nome,
				email: `${cenario.aluno.emailPrefix}.${identificador}@example.com`,
				matricula: `${cenario.aluno.matriculaPrefix}${identificador}`,
				senha: cenario.aluno.senha
			};

			// Etapa 2: autenticar como administrador.
			const tokenAdmin = await comTokenDeAdmin();
			const loginAdminResposta = await api()
				.post('/api/auth/login')
				.set('Content-Type', 'application/json')
				.send({
					email: process.env.ADMIN_EMAIL || 'admin@escola.com',
					senha: process.env.ADMIN_SENHA || process.env.ADMIN_PASSWORD || 'admin123'
				});

			// Etapa 3: validar o login e o token do administrador.
			expect(loginAdminResposta.status).to.equal(cenario.statusLoginAdmin);
			expect(tokenAdmin).to.match(/^Bearer /);

			// Etapa 4: cadastrar o novo aluno usando as credenciais do administrador.
			const cadastroAlunoResposta = await api()
				.post('/api/admin/alunos')
				.set('Content-Type', 'application/json')
				.set('Authorization', tokenAdmin)
				.send(dadosAluno);

			expect(cadastroAlunoResposta.status).to.equal(cenario.statusCadastroAluno);
			expect(cadastroAlunoResposta.body).to.include({
				nome: dadosAluno.nome,
				email: dadosAluno.email,
				matricula: dadosAluno.matricula,
				role: 'aluno'
			});
			expect(cadastroAlunoResposta.body).not.to.have.property('senha');

			// Etapa 5: validar o cadastro e guardar o ID do aluno criado.
			const alunoId = cadastroAlunoResposta.body.id;

			// Etapa 6: matricular o aluno na disciplina usada pela entrega.
			const matriculaResposta = await api()
				.post(`/api/admin/disciplinas/${cenario.disciplinaId}/matriculas`)
				.set('Content-Type', 'application/json')
				.set('Authorization', tokenAdmin)
				.send({ alunoId });

			expect(matriculaResposta.status).to.equal(201);
			expect(matriculaResposta.body).to.include({ alunoId, disciplinaId: cenario.disciplinaId });

			// Etapa 7: autenticar como o aluno recém-cadastrado.
			const tokenAluno = await comTokenDeAluno(dadosAluno.email, dadosAluno.senha);
			const loginAlunoResposta = await api()
				.post('/api/auth/login')
				.set('Content-Type', 'application/json')
				.send({ email: dadosAluno.email, senha: dadosAluno.senha });

			// Etapa 8: validar o login e o perfil do aluno.
			expect(loginAlunoResposta.status).to.equal(cenario.statusLoginAluno);
			expect(tokenAluno).to.match(/^Bearer /);
			expect(loginAlunoResposta.body.usuario).to.include({ id: alunoId, role: 'aluno' });

			// Etapa 9: registrar a entrega do trabalho como aluno autenticado.
			const entregaResposta = await api()
				.post(`/api/alunos/${alunoId}/trabalhos`)
				.set('Content-Type', 'application/json')
				.set('Authorization', tokenAluno)
				.send({ disciplinaId: cenario.disciplinaId, ...cenario.trabalho });

			// Etapa 10: validar a entrega e o status inicial do trabalho.
			expect(entregaResposta.status).to.equal(cenario.statusEntrega);
			expect(entregaResposta.body).to.include({
				alunoId,
				disciplinaId: cenario.disciplinaId,
				titulo: cenario.trabalho.titulo,
				descricao: cenario.trabalho.descricao,
				status: 'entregue'
			});
		});
	});
});
