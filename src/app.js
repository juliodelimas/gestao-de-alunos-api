import 'dotenv/config';
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
import './database/seed.js';
import loginRequest from './middlewares/loginRequest.js';
import { createLoginProtection } from './services/loginProtection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openapiYaml = fs.readFileSync(openapiPath, 'utf8');
const swaggerDocument = yaml.load(openapiYaml);

export function createApp({ protection = createLoginProtection(), logging = true } = {}) {
const app = express();
app.locals.loginProtection = protection;

app.use(cors());
if (logging) app.use(morgan('dev'));
app.post('/api/auth/login', loginRequest);
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
return app;
}

export default createApp();
