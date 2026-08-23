import Administrador from '../models/admin.model.js';
import Aluno from '../models/aluno.model.js';
import Disciplina from '../models/disciplina.model.js';
import Matricula from '../models/matricula.model.js';
import Nota from '../models/nota.model.js';
import Trabalho from '../models/trabalho.model.js';

// Senha padrão de todos os alunos seedados, apenas para fins de teste/demonstração.
const SENHA_PADRAO_ALUNO = '123456';
const SENHA_PADRAO_ADMIN = 'admin123';

async function seedAdministradores() {
  await Administrador.create([
    {
      _id: 'admin-principal',
      nome: 'Administrador do Sistema',
      email: 'admin@escola.com',
      senha: SENHA_PADRAO_ADMIN,
    },
  ]);
}

async function seedAlunos() {
  await Aluno.create([
    { _id: 'aluno-ana-souza', nome: 'Ana Souza', email: 'ana.souza@example.com', matricula: '2024001', senha: SENHA_PADRAO_ALUNO },
    { _id: 'aluno-bruno-lima', nome: 'Bruno Lima', email: 'bruno.lima@example.com', matricula: '2024002', senha: SENHA_PADRAO_ALUNO },
    { _id: 'aluno-carla-mendes', nome: 'Carla Mendes', email: 'carla.mendes@example.com', matricula: '2024003', senha: SENHA_PADRAO_ALUNO },
  ]);
}

async function seedDisciplinas() {
  await Disciplina.create([
    { _id: 'disciplina-matematica', nome: 'Matemática', codigo: 'MAT101', cargaHoraria: 60 },
    { _id: 'disciplina-historia', nome: 'História', codigo: 'HIS101', cargaHoraria: 40 },
    { _id: 'disciplina-programacao-web', nome: 'Programação Web', codigo: 'PRW201', cargaHoraria: 80 },
  ]);
}

async function seedMatriculas() {
  await Matricula.create([
    { _id: 'matricula-ana-matematica', alunoId: 'aluno-ana-souza', disciplinaId: 'disciplina-matematica' },
    { _id: 'matricula-ana-programacao', alunoId: 'aluno-ana-souza', disciplinaId: 'disciplina-programacao-web' },
    { _id: 'matricula-bruno-matematica', alunoId: 'aluno-bruno-lima', disciplinaId: 'disciplina-matematica' },
    { _id: 'matricula-bruno-historia', alunoId: 'aluno-bruno-lima', disciplinaId: 'disciplina-historia' },
    { _id: 'matricula-carla-programacao', alunoId: 'aluno-carla-mendes', disciplinaId: 'disciplina-programacao-web' },
  ]);
}

async function seedNotas() {
  await Nota.create([
    {
      _id: 'nota-ana-matematica-prova1',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-matematica',
      valor: 8.5,
      tipo: 'prova',
      descricao: 'Prova 1 - Álgebra',
    },
    {
      _id: 'nota-ana-programacao-prova1',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-programacao-web',
      valor: 9.2,
      tipo: 'prova',
      descricao: 'Prova 1 - HTML e CSS',
    },
    {
      _id: 'nota-bruno-matematica-prova1',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-matematica',
      valor: 6.0,
      tipo: 'prova',
      descricao: 'Prova 1 - Álgebra',
    },
    {
      _id: 'nota-bruno-historia-participacao1',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-historia',
      valor: 7.5,
      tipo: 'participacao',
      descricao: 'Participação em sala - 1º bimestre',
    },
    {
      _id: 'nota-carla-programacao-prova1',
      alunoId: 'aluno-carla-mendes',
      disciplinaId: 'disciplina-programacao-web',
      valor: 10,
      tipo: 'prova',
      descricao: 'Prova 1 - HTML e CSS',
    },
  ]);
}

async function seedTrabalhos() {
  await Trabalho.create([
    {
      _id: 'trabalho-ana-lista-exercicios-1',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-matematica',
      titulo: 'Lista de Exercícios 1',
      descricao: 'Resolução dos exercícios de 1 a 20 do capítulo 2.',
      status: 'entregue',
    },
    {
      _id: 'trabalho-bruno-linha-do-tempo',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-historia',
      titulo: 'Linha do Tempo - Revolução Industrial',
      descricao: 'Trabalho em grupo sobre os principais marcos da Revolução Industrial.',
      status: 'corrigido',
      nota: 8.0,
      feedback: 'Bom trabalho, faltou aprofundar o impacto social.',
    },
    {
      _id: 'trabalho-carla-landing-page',
      alunoId: 'aluno-carla-mendes',
      disciplinaId: 'disciplina-programacao-web',
      titulo: 'Landing Page Responsiva',
      descricao: 'Implementação de uma landing page usando HTML e CSS.',
      status: 'entregue',
    },
  ]);
}

export async function seed() {
  const jaSeedado = await Administrador.exists({});
  if (jaSeedado) return;
  await seedAdministradores();
  await seedAlunos();
  await seedDisciplinas();
  await seedMatriculas();
  await seedNotas();
  await seedTrabalhos();
}

await seed();

export default { seed };
