import bcrypt from 'bcryptjs';
import db from './db.js';

const agora = new Date().toISOString();

// Senha padrão de todos os alunos seedados, apenas para fins de teste/demonstração.
const SENHA_PADRAO_ALUNO = '123456';
const SENHA_PADRAO_ADMIN = 'admin123';

function seedAdministradores() {
  const administradores = [
    {
      id: 'admin-principal',
      nome: 'Administrador do Sistema',
      email: 'admin@escola.com',
      senha: bcrypt.hashSync(SENHA_PADRAO_ADMIN, 10),
      role: 'admin',
    },
  ];
  administradores.forEach((admin) =>
    db.insert('administradores', { ...admin, createdAt: agora, updatedAt: agora }),
  );
}

function seedAlunos() {
  const alunos = [
    {
      id: 'aluno-ana-souza',
      nome: 'Ana Souza',
      email: 'ana.souza@example.com',
      matricula: '2024001',
    },
    {
      id: 'aluno-bruno-lima',
      nome: 'Bruno Lima',
      email: 'bruno.lima@example.com',
      matricula: '2024002',
    },
    {
      id: 'aluno-carla-mendes',
      nome: 'Carla Mendes',
      email: 'carla.mendes@example.com',
      matricula: '2024003',
    },
  ];
  alunos.forEach((aluno) =>
    db.insert('alunos', {
      ...aluno,
      senha: bcrypt.hashSync(SENHA_PADRAO_ALUNO, 10),
      role: 'aluno',
      createdAt: agora,
      updatedAt: agora,
    }),
  );
}

function seedDisciplinas() {
  const disciplinas = [
    { id: 'disciplina-matematica', nome: 'Matemática', codigo: 'MAT101', cargaHoraria: 60 },
    { id: 'disciplina-historia', nome: 'História', codigo: 'HIS101', cargaHoraria: 40 },
    {
      id: 'disciplina-programacao-web',
      nome: 'Programação Web',
      codigo: 'PRW201',
      cargaHoraria: 80,
    },
  ];
  disciplinas.forEach((disciplina) =>
    db.insert('disciplinas', { ...disciplina, createdAt: agora, updatedAt: agora }),
  );
}

function seedMatriculas() {
  const matriculas = [
    {
      id: 'matricula-ana-matematica',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-matematica',
    },
    {
      id: 'matricula-ana-programacao',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-programacao-web',
    },
    {
      id: 'matricula-bruno-matematica',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-matematica',
    },
    {
      id: 'matricula-bruno-historia',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-historia',
    },
    {
      id: 'matricula-carla-programacao',
      alunoId: 'aluno-carla-mendes',
      disciplinaId: 'disciplina-programacao-web',
    },
  ];
  matriculas.forEach((matricula) =>
    db.insert('matriculas', { ...matricula, dataMatricula: agora }),
  );
}

function seedNotas() {
  const notas = [
    {
      id: 'nota-ana-matematica-prova1',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-matematica',
      valor: 8.5,
      tipo: 'prova',
      descricao: 'Prova 1 - Álgebra',
    },
    {
      id: 'nota-ana-programacao-prova1',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-programacao-web',
      valor: 9.2,
      tipo: 'prova',
      descricao: 'Prova 1 - HTML e CSS',
    },
    {
      id: 'nota-bruno-matematica-prova1',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-matematica',
      valor: 6.0,
      tipo: 'prova',
      descricao: 'Prova 1 - Álgebra',
    },
    {
      id: 'nota-bruno-historia-participacao1',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-historia',
      valor: 7.5,
      tipo: 'participacao',
      descricao: 'Participação em sala - 1º bimestre',
    },
    {
      id: 'nota-carla-programacao-prova1',
      alunoId: 'aluno-carla-mendes',
      disciplinaId: 'disciplina-programacao-web',
      valor: 10,
      tipo: 'prova',
      descricao: 'Prova 1 - HTML e CSS',
    },
  ];
  notas.forEach((nota) => db.insert('notas', { ...nota, createdAt: agora, updatedAt: agora }));
}

function seedTrabalhos() {
  const trabalhos = [
    {
      id: 'trabalho-ana-lista-exercicios-1',
      alunoId: 'aluno-ana-souza',
      disciplinaId: 'disciplina-matematica',
      titulo: 'Lista de Exercícios 1',
      descricao: 'Resolução dos exercícios de 1 a 20 do capítulo 2.',
      status: 'entregue',
      nota: null,
      feedback: null,
    },
    {
      id: 'trabalho-bruno-linha-do-tempo',
      alunoId: 'aluno-bruno-lima',
      disciplinaId: 'disciplina-historia',
      titulo: 'Linha do Tempo - Revolução Industrial',
      descricao: 'Trabalho em grupo sobre os principais marcos da Revolução Industrial.',
      status: 'corrigido',
      nota: 8.0,
      feedback: 'Bom trabalho, faltou aprofundar o impacto social.',
    },
    {
      id: 'trabalho-carla-landing-page',
      alunoId: 'aluno-carla-mendes',
      disciplinaId: 'disciplina-programacao-web',
      titulo: 'Landing Page Responsiva',
      descricao: 'Implementação de uma landing page usando HTML e CSS.',
      status: 'entregue',
      nota: null,
      feedback: null,
    },
  ];
  trabalhos.forEach((trabalho) =>
    db.insert('trabalhos', { ...trabalho, dataEntrega: agora, createdAt: agora, updatedAt: agora }),
  );
}

export function seed() {
  if (db.all('administradores').length > 0) return;
  seedAdministradores();
  seedAlunos();
  seedDisciplinas();
  seedMatriculas();
  seedNotas();
  seedTrabalhos();
}

seed();

export default { seed };
