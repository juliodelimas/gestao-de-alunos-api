require('dotenv').config({ quiet: true });
const uri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/gestao-de-alunos-test';
const database = uri.split('?')[0].split('/').pop();
if (!database || !database.endsWith('-test')) {
  throw new Error('TEST_MONGODB_URI deve apontar para um banco com sufixo -test.');
}
process.env.MONGODB_URI = uri;
process.env.SEED_ADMIN_PASSWORD ||= process.env.TEST_ADMIN_PASSWORD;
process.env.SEED_STUDENT_PASSWORD ||= process.env.TEST_STUDENT_PASSWORD;
exports.mochaHooks = {
  async beforeEach() {
    const { default: app } = await import('../src/app.js');
    app.locals.loginProtection.reset();
  },
  async afterAll() { await require('mongoose').disconnect(); },
};
