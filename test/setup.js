import 'dotenv/config';

// Carregado pelo Mocha antes dos arquivos de teste (via "require" no .mocharc.json).
// O src/database/db.js abre a conexão no momento em que é importado, lendo MONGODB_URI —
// por isso a troca para o banco de teste precisa acontecer aqui.
if (process.env.MONGODB_URI_TEST) {
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
}

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// A conexão do Mongoose é compartilhada por todos os testes (o app é importado uma única vez),
// então ela é fechada num root hook: dentro de um arquivo de teste, quebraria os demais.
export const mochaHooks = {
  async afterAll() {
    const { default: mongoose } = await import('mongoose');
    await mongoose.connection.close();
  },
};
