# Apex Service - Reservation API

API de gerenciamento de reservas para sistema terminal de transporte. Sistema construído com **Domain-Driven Design (DDD)** e **NestJS**, focado em escalabilidade e manutenibilidade.

## 📋 Visão Geral

**Apex Service** é uma API REST para gerenciar reservas de passagens em terminais de transporte. Cada reserva está ligada a um **Slot** (horário disponível) e um **Passageiro**. O sistema oferece operações completas de CRUD, validação de negócio e persistência com SQLite.

### Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/reservations` | Listar reservas (com filtros e paginação) |
| `GET` | `/reservations/:id` | Buscar reserva por ID |
| `POST` | `/reservations` | Criar nova reserva |
| `PATCH` | `/reservations/:id/confirm` | Confirmar reserva |
| `PATCH` | `/reservations/:id/checkin` | Fazer check-in na reserva |
| `DELETE` | `/reservations/:id` | Cancelar/remover reserva |

### 📚 Documentação Interativa

Acesse o Swagger em: **`http://localhost:3000/docs`**

---

## 🚀 Setup & Instalação

### Pré-requisitos

- **Node.js** ≥ 18.x
- **npm** ou **yarn**
- Git (para clonar o repositório)

### 1. Clonar e Instalar Dependências

```bash
# Clonar repo
git clone <repo-url>
cd apex-service

# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.dev.env` na raiz:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=file:./dev.db
```

### 3. Executar Migrations do Prisma

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Rodar migrations
npm run prisma:migrate
```

### 4. Iniciar o Servidor

```bash
# Modo desenvolvimento (watch mode)
npm run start:dev

# Modo debug
npm run start:debug

# Modo produção
npm run build
npm run start:prod
```

O servidor estará disponível em: **`http://localhost:3000`**

---

## 📦 Scripts Disponíveis

```bash
npm run start          # Inicia servidor
npm run start:dev      # Inicia com reload automático
npm run start:debug    # Inicia com debugger
npm run start:prod     # Usa build transpilado
npm run build          # Compila TypeScript
npm run lint           # Valida código com ESLint
npm run format         # Formata com Prettier
npm run test           # Roda testes (Vitest)
npm run test:watch     # Testes com watch mode
npm run test:coverage  # Gera relatório de cobertura
npm run prisma:generate # Gera cliente Prisma
npm run prisma:migrate # Executa migrations
npm run prisma:studio  # Abre Prisma Studio (GUI)
```

---

## 🏗️ Arquitetura e Decisões Técnicas

### Padrão: Domain-Driven Design (DDD)

A aplicação segue **DDD** com camadas bem separadas:

```
src/modules/reservations/
├── domain/                          # Lógica de negócio pura
│   └── reservation/
│       ├── application/
│       │   ├── use-cases/          # Casos de uso (executam lógica)
│       │   ├── events/             # Eventos de domínio
│       │   └── repositories/       # Abstrações de persistência
│       └── enterprise/
│           ├── entities/           # Entidades de domínio
│           └── enums/              # Enums de negócio
├── infra/                           # Detalhes de implementação
│   ├── database/                    # Prisma ORM, migrations
│   └── config/                      # Variáveis de ambiente
└── interfaces/                      # Camada de apresentação
    └── http/                        # Controllers, DTOs, Swagger
        ├── controllers/             # Rotas HTTP
        ├── dtos/                    # Objetos de transferência de dados
        ├── mappers/                 # Conversão entre camadas
        ├── pipes/                   # Validação (Zod)
        ├── presenters/              # Formatação de respostas
        └── schemas/                 # Esquemas Zod
```

### Decisões Técnicas Principais

#### 1. **NestJS Framework** ✅
- **Razão:** Framework robusto com DI nativa, ideal para DDD
- **Trade-off:** Mais "opinativo" que Express, mas melhor estrutura
- **Alternativa rejeitada:** Express (mais flexível, mas sem estrutura)

#### 2. **Domain-Driven Design (DDD)** ✅
- **Razão:** Separação clara entre lógica de negócio e infraestrutura
- **Trade-off:** Mais arquivos/pastas, mas código mais testável e escalável
- **Alternativa rejeitada:** MVC simples (menos escalável em projetos complexos)

#### 3. **Prisma ORM** ✅
- **Razão:** Type-safe queries, migrations automáticas, excelente DX
- **Trade-off:** Vendor lock-in (difícil trocar por outro ORM)
- **Alternativa rejeitada:** TypeORM (mais verboso), Raw SQL (sem type-safety)

#### 4. **SQLite** ✅
- **Razão:** Zero configuração, perfeito para desenvolvimento e protótipos
- **Trade-off:** Não é escalável para milhões de registros ou alta concorrência
- **Plano de upgrade:** PostgreSQL para produção (Prisma suporta ambos)

#### 5. **Zod para Validação** ✅
- **Razão:** Type-safe schema validation, integração com NestJS via `nestjs-zod`
- **Trade-off:** Biblioteca pequena, menos madura que Joi
- **Alternativa rejeitada:** Class-validator (mais decoradores, menos funcional)

#### 6. **Swagger/OpenAPI** ✅
- **Razão:** Documentação automática e interativa dos endpoints
- **Trade-off:** Decoradores extras nos controllers
- **Benefício:** Testes manuais direto na UI

#### 7. **Either Pattern para Erros** ✅
- **Razão:** Tratamento funcional de erros, sem exceções
- **Trade-off:** Mais verboso que throw/catch nativo
- **Benefício:** Erros são previsíveis e documentados

#### 8. **Validação em Param/Query com Zod** ✅
- **Razão:** Oferece type-safety na validação automática
- **Trade-off:** Menos comum que decoradores class-based
- **Alternativa rejeitada:** Class-validator (abordagem menos declarativa)

---

## 🔄 Fluxo de uma Requisição

```
HTTP Request
    ↓
Controller (valida com Zod via ZodValidationPipe)
    ↓
Mapper (converte para Input)
    ↓
UseCase (executa lógica de negócio)
    ↓
Repository (persiste no banco)
    ↓
Presenter (formata Response)
    ↓
HTTP Response (200/201/204/400/409/500)
```

---

## 🗄️ Modelo de Dados

### Entidades Principais

#### **Reservation** (Reserva)
```json
{
  "id": "uuid",
  "slotId": "uuid",
  "passengerId": "uuid",
  "date": "datetime",
  "status": "PENDING | CONFIRMED | CHECKED_IN | COMPLETED | CANCELLED"
}
```

#### **Slot** (Horário Disponível)
```json
{
  "id": "uuid",
  "name": "string"
}
```

#### **Passenger** (Passageiro)
```json
{
  "id": "uuid",
  "name": "string"
}
```

---

## ✔️ Validação e Tratamento de Erros

### Validação (Zod)

Todos os inputs são validados via **Zod Schemas**:

```typescript
// Exemplo: POST /reservations
{
  "passengerId": "550e8400-e29b-41d4-a716-446655440000",
  "slotId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Respostas de Erro

```json
// 404 - Reserva não encontrada
{
  "statusCode": 404,
  "message": "Reservation not found"
}

// 409 - Slot indisponível
{
  "statusCode": 409,
  "message": "Slot not available"
}

// 400 - Validação falhou
{
  "statusCode": 400,
  "message": "Invalid input",
  "errors": { "passengerId": "Invalid UUID" }
}
```

---

## 🧪 Testes

A aplicação usa **Vitest** para testes rápidos:

```bash
# Rodar testes
npm run test

# Watch mode
npm run test:watch

# Cobertura
npm run test:coverage
```

---

## 🔐 Variáveis de Ambiente

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `PORT` | `3000` | Porta do servidor |
| `NODE_ENV` | `development` | Ambiente (development/production) |
| `DATABASE_URL` | `file:./dev.db` | URL da database |

Para **produção**, altere:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/apex
```

---

## 📊 Banco de Dados

### Schema (Prisma)

```prisma
model Reservation {
  id          String @id
  slotId      String
  passengerId String
  date        DateTime
  status      ReservationStatus
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CHECKED_IN
  COMPLETED
  CANCELLED
}

model Slot {
  id   String @id
  name String
}

model Passenger {
  id   String @id
  name String
}
```

### Acessar Banco (Prisma Studio)

```bash
npm run prisma:studio
# Abre GUI em http://localhost:5555
```

---

## 🎯 Próximos Passos / Improvements

- [ ] Autenticação/Autorização (JWT)
- [ ] Rate limiting
- [ ] Logging centralizado
- [ ] Métricas (Prometheus)
- [ ] Cache (Redis)
- [ ] Testes E2E completos
- [ ] Migrations automáticas em CI/CD
- [ ] Upgrade para PostgreSQL em produção
- [ ] Message queues (para eventos assíncronos)
- [ ] Soft deletes para Reservas
- [ ] Audit trail (histórico de mudanças)

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit com mensagens claras: `git commit -m "feat: descrição"`
3. Push e abra um Pull Request

**Padrões de código:**
- Use as convenções do ESLint/Prettier
- Sempre execute `npm run lint` antes de PR
- Mantenha a arquitetura DDD
- Adicione testes para novas features

---

## 📝 Licença

UNLICENSED - Código proprietário

---

## 📧 Troubleshooting

### "ReferenceError: exports is not defined"
- Verifique `tsconfig.json` tem `"module": "commonjs"`
- Rode `npm run build` novamente

### "Cannot find module '@/...'
- Paths aliases não carregaram
- Rode `npm install` novamente

### "Port 3000 is already in use"
- Mude a porta: `PORT=3001 npm run start:dev`
- Ou mate o processo: `lsof -ti:3000 | xargs kill -9`

### Swagger não aparece
- Verifique se servidor iniciou sem erros
- Acesse `http://localhost:3000/docs` (com `/docs` no final)

### Controllers não aparecem no Swagger
- Verifique se estão com `@Controller()` e métodos com `@Get()`, `@Post()`, etc
- Verifique decoradores `@ApiOperation()` e `@ApiOkResponse()`

### Erros de validação com Zod
- Verifique formato do input (UUIDs v4, datas ISO)
- Consulte schema em `src/.../schemas/`

---

## 🔍 Estrutura de Pastas Detalhada

```
apex-service/
├── src/
│   ├── main.ts                                 # Entry point da aplicação
│   ├── app.module.ts                          # Root module
│   ├── core/
│   │   └── either/                            # Either pattern para tratamento de erro
│   ├── generated/                             # ⚠️ Auto-gerado pelo Prisma
│   │   ├── client.ts
│   │   ├── enums.ts
│   │   ├── models.ts
│   │   └── ...
│   └── modules/
│       └── reservations/
│           ├── domain/
│           │   └── reservation/
│           │       ├── application/
│           │       │   ├── use-cases/         # CreateReservation, ListReservation, etc
│           │       │   ├── events/            # Domain events (ex: ReservationConfirmed)
│           │       │   └── repositories/      # Interfaces abstratas
│           │       └── enterprise/
│           │           ├── entities/          # Reservation entity
│           │           └── enums/             # ReservationStatus
│           ├── infra/
│           │   ├── database/
│           │   │   ├── prisma/
│           │   │   │   ├── prisma.module.ts
│           │   │   │   └── prisma.service.ts
│           │   │   ├── mappers/              # PrismaReservationMapper
│           │   │   └── repositories/         # PrismaReservationRepository (implementação)
│           │   └── config/
│           │       ├── config.module.ts
│           │       ├── configuration.ts
│           │       ├── env.schema.ts
│           │       └── validate-env.ts
│           └── interfaces/
│               └── http/
│                   ├── controllers/          # 6 controllers (Create, List, Get, etc)
│                   ├── dtos/                 # Request/Response DTOs com @ApiProperty
│                   ├── mappers/              # HTTP layer to Application layer
│                   ├── pipes/                # ZodValidationPipe
│                   ├── presenters/           # Formatação de response
│                   ├── schemas/              # Zod schemas para validação
│                   ├── errors/               # InvalidBodyError
│                   └── http.module.ts
├── prisma/
│   ├── schema.prisma                         # Schema do Prisma
│   └── migrations/                           # Histórico de migrations
├── test/
│   └── app.e2e-spec.ts
├── package.json
├── tsconfig.json                             # "module": "commonjs"
├── tsconfig.build.json
├── eslint.config.mjs
├── vitest.config.ts
├── nest-cli.json
└── README.md
```

---

**Desenvolvido com ❤️ usando NestJS + DDD**
