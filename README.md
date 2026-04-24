# SalesCoach

Plataforma de treinamento de vendedores com clientes fictícios controlados por LLM.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Banco de dados:** PostgreSQL 16 (Docker)
- **ORM:** Prisma 7 com `@prisma/adapter-pg`
- **Autenticação:** Auth.js v5 (credentials provider, JWT)
- **UI:** Shadcn/ui, Tailwind CSS 4, fontes Syne + DM Sans
- **Testes:** Vitest (integração contra banco real)

## Pré-requisitos

- Node.js >= 20
- Docker e Docker Compose

## Setup

### 1. Clonar e instalar dependências

```bash
git clone <repo-url>
cd projeto-claude-formacao
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário. Os valores padrão já funcionam com o Docker Compose incluso:

```
DATABASE_URL="postgresql://salescoach:salescoach@localhost:5435/salescoach?schema=public"
AUTH_SECRET="generate-a-random-secret-here"
```

### 3. Subir o banco de dados

```bash
docker compose up -d
```

O PostgreSQL fica acessível na porta **5435**.

### 4. Rodar migrations e gerar o client

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Seed (criar usuário admin)

```bash
npx tsx prisma/seed.ts
```

Cria o admin padrão:
- **Email:** `admin@salescoach.com`
- **Senha:** `admin123`

### 6. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Testes

Os testes rodam contra um banco de teste separado (`salescoach_test`).

### Criar o banco de teste

```bash
docker exec projeto-claude-formacao-db-1 psql -U salescoach -c "CREATE DATABASE salescoach_test;"
DATABASE_URL="postgresql://salescoach:salescoach@localhost:5435/salescoach_test?schema=public" npx prisma migrate deploy
```

### Rodar testes

```bash
npm test           # execução única
npm run test:watch # modo watch
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm test` | Rodar testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` | Linting com ESLint |

## Estrutura do projeto

```
src/
├── app/
│   ├── (protected)/       # Rotas com sidebar (admin e vendedor)
│   │   ├── admin/
│   │   └── treinar/
│   ├── api/auth/          # Auth.js route handlers
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raiz (fontes, metadata)
├── components/
│   ├── sidebar.tsx        # Sidebar com navegação por role
│   └── ui/                # Componentes Shadcn/ui
├── lib/
│   ├── auth.ts            # Configuração Auth.js
│   ├── auth-utils.ts      # authorize() e redirectByRole()
│   ├── db.ts              # Singleton do Prisma
│   ├── middleware-utils.ts # Lógica pura de proteção de rotas
│   └── seed.ts            # Função de seed
├── middleware.ts           # Proteção de rotas por role
└── __tests__/              # Testes de integração
prisma/
├── schema.prisma           # Schema do banco
├── seed.ts                 # Script de seed
└── migrations/             # Migrations
```

## Roles e rotas

| Role | Rotas permitidas | Redirect padrão |
|------|------------------|-----------------|
| `ADMIN` | `/admin/*` | `/admin` |
| `SELLER` | `/treinar/*` | `/treinar` |
| Não autenticado | `/login` | `/login` |
