# Gestão de Alunos API

API REST para gestão de alunos, disciplinas, notas e trabalhos, com persistência em MongoDB.

## Descrição

A API modela um cenário simples de gestão escolar com dois tipos de uso:

- **Administrador**: cadastra alunos, cadastra disciplinas, matricula alunos em disciplinas e
  lança notas.
- **Aluno**: consulta as disciplinas em que está matriculado, consulta suas próprias notas e
  registra trabalhos (entregas) para as disciplinas cursadas.

Essas duas perspectivas são refletidas diretamente na organização das rotas:

- `/api/admin/*` — operações do administrador (CRUD de alunos, disciplinas, matrículas, notas e
  correção de trabalhos). **Restrito a usuários com papel `admin`.**
- `/api/alunos/*` — autoatendimento do aluno (consulta de disciplinas, consulta de notas e
  registro de trabalhos). **Restrito ao próprio aluno autenticado (dono do `alunoId`) ou a um
  administrador.**

Toda a API é protegida por autenticação **JWT**, exceto o endpoint de login. Não existe endpoint
de cadastro de administrador — ele já vem pré-cadastrado no banco (veja
[Autenticação](#autenticação) abaixo).

O banco de dados é **MongoDB**, acessado via **Mongoose**. Os dados persistem entre reinícios do
servidor; a carga inicial de dados fake (seed) só é executada uma vez, na primeira vez em que o
banco está vazio (veja [Dados fake pré-carregados](#dados-fake-pré-carregados) abaixo).

## Stack utilizada

- **Node.js** com módulos ES (`"type": "module"` no `package.json`)
- **Express** — framework web e roteamento
- **MongoDB** com **Mongoose** — persistência dos dados (alunos, disciplinas, matrículas, notas e
  trabalhos)
- **jsonwebtoken** — emissão e verificação dos tokens JWT usados na autenticação
- **bcryptjs** — hash das senhas armazenadas no banco
- **js-yaml** — carregamento do arquivo de documentação OpenAPI em YAML
- **swagger-ui-express** — renderização do Swagger UI a partir do YAML
- **cors** — liberação de CORS para consumo por outros clientes/origens
- **morgan** — log de requisições HTTP no console
- **nodemon** (dependência de desenvolvimento) — reinício automático do servidor durante o
  desenvolvimento

A autenticação é real: senhas com hash (bcrypt) e sessões via JWT assinado.

## Arquitetura do código

```
src/
  app.js                 # configuração do Express: middlewares, Swagger, rotas, erros
  server.js              # ponto de entrada: sobe o servidor HTTP (separado do app)
  config/
    jwt.js                # segredo e tempo de expiração do JWT
  routes/                # definição das rotas (Express Router), sem lógica de negócio
    index.js
    auth.routes.js         # login -> /api/auth (público)
    aluno.routes.js       # rotas de autoatendimento do aluno -> /api/alunos (protegidas)
    admin/                # rotas do administrador -> /api/admin (protegidas, papel admin)
  controllers/            # lida com req/res, delega para os services
  services/               # regras de negócio e validações
  models/                 # schemas Mongoose das entidades, incluindo hash de senha (pre-save)
  database/
    db.js                 # conexão com o MongoDB via Mongoose
    seed.js                # dados fake carregados na inicialização, se o banco estiver vazio (inclui o admin)
  middlewares/
    authenticate.js        # valida o JWT e popula req.user
    authorize.js            # restringe uma rota a um ou mais papéis (ex.: "admin")
    authorizeSelfOrAdmin.js # em /api/alunos/:alunoId, exige ser o próprio aluno ou um admin
    notFound.js
    errorHandler.js
  utils/
    ApiError.js
    asyncHandler.js
docs/
  openapi.yaml            # especificação Swagger/OpenAPI (fonte da documentação)
```

## Instalação e execução

Pré-requisitos:

- Node.js 18+ (usa `crypto.randomUUID`, disponível nativamente).
- Uma instância do **MongoDB** acessível (local ou remota).

```bash
# instalar dependências
npm install

# subir em modo produção
npm start

# subir em modo desenvolvimento (reinício automático com nodemon)
npm run dev
```

O servidor sobe por padrão em `http://localhost:3000` (pode ser alterado com a variável de
ambiente `PORT`).

### Configuração do MongoDB

Por padrão, a API se conecta a um MongoDB local em
`mongodb://127.0.0.1:27017/gestao-de-alunos`. Para usar outra instância (ex.: MongoDB Atlas ou um
container), defina a variável de ambiente `MONGODB_URI` antes de subir o servidor:

```bash
MONGODB_URI="mongodb://usuario:senha@host:27017/nome-do-banco" npm start
```

Na primeira execução com o banco vazio, a API popula automaticamente as coleções com o conjunto de
dados fake descrito em [Dados fake pré-carregados](#dados-fake-pré-carregados). Em execuções
seguintes, os dados já existentes são preservados.

## Documentação da API (Swagger)

A documentação completa de todas as rotas, parâmetros, corpos de requisição e respostas está
disponível em:

- **Swagger UI (interface interativa):** `http://localhost:3000/api-docs`
- **Arquivo YAML bruto servido pela API:** `http://localhost:3000/api-docs.yaml`
- **Fonte do arquivo no repositório:** [`docs/openapi.yaml`](docs/openapi.yaml)

A raiz da API (`GET /`) também retorna um JSON simples com o nome, descrição e o link para a
documentação.

## Autenticação

A API usa **JWT** (`Authorization: Bearer <token>`). Todas as rotas exigem um token válido,
exceto `POST /api/auth/login`.

1. Faça login informando `email` e `senha` de um administrador ou de um aluno já cadastrado:

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@escola.com","senha":"admin123"}'
   ```

   A resposta traz o `token` e os dados básicos do usuário autenticado (`id`, `nome`, `email`,
   `role`).

2. Envie o token nas próximas requisições:

   ```bash
   curl http://localhost:3000/api/admin/alunos \
     -H "Authorization: Bearer <token>"
   ```

No Swagger UI (`/api-docs`), clique em **Authorize** e informe `Bearer <token>` para testar as
rotas protegidas diretamente pela interface.

### Regras de autorização

- **`/api/admin/*`** — exige token com papel `admin`. É aqui que alunos, disciplinas e notas são
  cadastrados; apenas o administrador tem acesso.
- **`/api/alunos/{alunoId}/*`** — exige token válido (admin ou aluno). Um aluno só acessa quando
  `alunoId` é o seu próprio id; um administrador pode acessar os dados de qualquer aluno.
- Não existe endpoint para cadastrar administradores: o único admin do sistema já vem
  pré-cadastrado no banco pelo seed (credenciais na seção de dados fake abaixo).
- Quando um administrador cadastra um aluno (`POST /api/admin/alunos`), ele também define a senha
  inicial de acesso desse aluno (campo `senha`, obrigatório no cadastro).
- Senhas nunca são retornadas pela API — são armazenadas apenas como hash (bcrypt).

## Dados fake pré-carregados

Na primeira vez que a API sobe com o banco vazio, o seed popula o MongoDB com os dados abaixo (ids
legíveis, para facilitar testes manuais via Swagger UI ou curl). Todas as senhas abaixo são apenas
para demonstração.

### Administrador (`/api/auth/login`)

| id               | nome                       | email             | senha    |
|------------------|-----------------------------|-------------------|----------|
| `admin-principal`| Administrador do Sistema   | admin@escola.com  | admin123 |

### Alunos (`/api/admin/alunos`)

| id                   | nome          | email                       | matrícula | senha  |
|----------------------|---------------|------------------------------|-----------|--------|
| `aluno-ana-souza`    | Ana Souza     | ana.souza@example.com       | 2024001   | 123456 |
| `aluno-bruno-lima`   | Bruno Lima    | bruno.lima@example.com      | 2024002   | 123456 |
| `aluno-carla-mendes` | Carla Mendes  | carla.mendes@example.com    | 2024003   | 123456 |

### Disciplinas (`/api/admin/disciplinas`)

| id                            | nome              | código  | carga horária |
|--------------------------------|-------------------|---------|----------------|
| `disciplina-matematica`        | Matemática        | MAT101  | 60h            |
| `disciplina-historia`          | História          | HIS101  | 40h            |
| `disciplina-programacao-web`   | Programação Web   | PRW201  | 80h            |

### Matrículas

| aluno         | disciplina         |
|---------------|---------------------|
| Ana Souza     | Matemática          |
| Ana Souza     | Programação Web     |
| Bruno Lima    | Matemática          |
| Bruno Lima    | História            |
| Carla Mendes  | Programação Web     |

### Notas (`/api/admin/notas`)

| aluno         | disciplina         | tipo         | valor |
|---------------|---------------------|--------------|-------|
| Ana Souza     | Matemática          | prova        | 8.5   |
| Ana Souza     | Programação Web     | prova        | 9.2   |
| Bruno Lima    | Matemática          | prova        | 6.0   |
| Bruno Lima    | História            | participação | 7.5   |
| Carla Mendes  | Programação Web     | prova        | 10    |

### Trabalhos (`/api/admin/trabalhos`)

| aluno         | disciplina    | título                                  | status      |
|---------------|---------------|-------------------------------------------|-------------|
| Ana Souza     | Matemática    | Lista de Exercícios 1                     | entregue    |
| Bruno Lima    | História      | Linha do Tempo - Revolução Industrial     | corrigido (nota 8.0) |
| Carla Mendes  | Programação Web | Landing Page Responsiva                 | entregue    |

### Exemplos rápidos de uso

```bash
# Login como admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@escola.com","senha":"admin123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

# Admin: listar alunos
curl http://localhost:3000/api/admin/alunos -H "Authorization: Bearer $ADMIN_TOKEN"

# Admin: matricular a Carla em História
curl -X POST http://localhost:3000/api/admin/disciplinas/disciplina-historia/matriculas \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alunoId":"aluno-carla-mendes"}'

# Admin: lançar uma nota
curl -X POST http://localhost:3000/api/admin/notas \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alunoId":"aluno-ana-souza","disciplinaId":"disciplina-matematica","valor":7.8,"tipo":"trabalho"}'

# Login como aluno (Ana)
ALUNO_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana.souza@example.com","senha":"123456"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

# Aluno: ver minhas disciplinas
curl http://localhost:3000/api/alunos/aluno-ana-souza/disciplinas -H "Authorization: Bearer $ALUNO_TOKEN"

# Aluno: ver minhas notas
curl http://localhost:3000/api/alunos/aluno-ana-souza/notas -H "Authorization: Bearer $ALUNO_TOKEN"

# Aluno: registrar um trabalho
curl -X POST http://localhost:3000/api/alunos/aluno-ana-souza/trabalhos \
  -H "Authorization: Bearer $ALUNO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"disciplinaId":"disciplina-matematica","titulo":"Lista de Exercícios 2"}'
```

> Novos registros criados via API recebem ids no formato UUID (gerados com
> `crypto.randomUUID()`), diferente dos ids legíveis usados nos dados fake acima.
