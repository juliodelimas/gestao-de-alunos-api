import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import { NODE_ENV } from './config/env.js';
import './database/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openapiYaml = fs.readFileSync(openapiPath, 'utf8');
const swaggerDocument = yaml.load(openapiYaml);

const app = express();

app.use(cors());
// Nos testes o log de cada requisição só polui a saída do Mocha.
if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.yaml', (req, res) => {
  res.type('text/yaml').send(openapiYaml);
});

app.get('/', (req, res) => {
  res.json({
    nome: 'Gestão de Alunos API',
    descricao: 'API REST para gestão de alunos, disciplinas, notas e trabalhos.',
    documentacao: '/api-docs',
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
