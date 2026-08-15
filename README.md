# 🏭 Controle de Produção

Aplicação web full stack para gerenciamento e acompanhamento de **clientes, peças, pedidos e ordens de serviço** em um ambiente de produção industrial.

O sistema centraliza informações que normalmente estariam distribuídas entre planilhas e controles separados, permitindo acompanhar o andamento da produção, entregas, atrasos e indicadores operacionais em uma única interface.

**Versão atual: v1.1.0**

![Dashboard do Controle de Produção](docs/screenshots/dashboard.png)

---

## 💡 Motivação

O projeto surgiu a partir da observação de processos reais de controle de produção, nos quais informações sobre pedidos, peças, prazos e andamento da fabricação podem acabar distribuídas entre diferentes controles.

A proposta foi transformar esse problema em uma aplicação full stack, utilizando o projeto tanto para experimentar uma solução para o domínio quanto para aplicar conceitos de desenvolvimento de software.

Mais do que desenvolver um CRUD, o objetivo foi modelar relações e regras existentes em um fluxo produtivo real.

---

## ✨ Principais funcionalidades

### 📊 Dashboard

O dashboard oferece uma visão consolidada da produção e permite navegar entre diferentes meses.

Atualmente apresenta:

- ordens de serviço pendentes;
- entregas previstas no mês;
- índice de atraso;
- índice de RNC;
- índice de devolução;
- entregas prioritárias;
- ordens próximas do prazo ou já atrasadas.

### 👥 Clientes

- Cadastro, edição e visualização;
- Pesquisa por nome;
- Filtro por clientes ativos/inativos;
- Ordenação alfabética;
- Paginação.

### ⚙️ Peças

- Cadastro, edição e visualização;
- Associação da peça a um cliente;
- Informações de material e descrição;
- Tratamentos térmicos e superficiais;
- Terceirização e observações;
- Pesquisa por código;
- Filtro por cliente;
- Ordenação e paginação.

### 📦 Pedidos

- Cadastro, edição e visualização;
- Associação a clientes;
- Controle de status;
- Pesquisa por código;
- Filtros por cliente e status;
- Ordenação e paginação.

### 🏭 Ordens de Serviço

- Cadastro, edição e visualização;
- Associação entre pedido e peça;
- Controle de quantidade e horas de produção;
- Cálculo automático de horas totais no backend;
- Controle de status e setor atual;
- Registro de RNC e devolução;
- Controle de datas previstas e realizadas;
- Pesquisa por número da OS ou código da peça;
- Filtros por cliente, status e setor;
- Ordenação e paginação;
- Alteração rápida de status e setor pela listagem.

---

## 🖥️ Interface

### Ordens de Serviço

![Listagem de Ordens de Serviço](docs/screenshots/ordens-servico.png)

### Cadastro de Ordem de Serviço

![Formulário de Ordem de Serviço](docs/screenshots/ordem-servico-form.png)

> Os screenshots devem ser adicionados em `docs/screenshots/`.

---

## 🛠️ Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM

### Banco de dados e infraestrutura

- PostgreSQL
- Docker
- Docker Compose

---

## 🧱 Arquitetura

O backend foi organizado em camadas com responsabilidades separadas:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

### Controller

Responsável pela camada HTTP:

- recebe as requisições;
- interpreta parâmetros;
- chama os services;
- retorna os códigos HTTP adequados.

### Service

Concentra as principais regras de negócio:

- validação dos dados;
- normalização dos payloads;
- validação de relacionamentos;
- prevenção de estados inconsistentes.

### Repository

Responsável pelo acesso e persistência dos dados através do Prisma.

Essa separação evita concentrar regras de negócio diretamente nas rotas ou nas consultas ao banco.

---

## 🔗 Modelo do domínio

As quatro principais entidades do sistema são:

```text
Cliente
 ├── Peças
 └── Pedidos
       │
       └────┐
            │
Peça ───────┴── Ordem de Serviço
```

### Cliente

Representa a empresa para a qual os serviços são realizados.

Um cliente pode possuir diversas peças e pedidos.

### Peça

Representa uma peça cadastrada para determinado cliente.

Cada peça pode possuir informações como:

- código;
- descrição;
- material;
- tratamento térmico;
- tratamento superficial;
- terceirização.

### Pedido

Representa um pedido realizado por um cliente e possui controle de status.

### Ordem de Serviço

É a principal entidade operacional do sistema.

Relaciona um **Pedido** a uma **Peça** e armazena informações necessárias para acompanhar sua fabricação e entrega.

---

## ⚙️ Principais regras de negócio

Além das operações CRUD, o backend possui regras para manter a consistência dos dados.

### Pedido × Peça

Uma Ordem de Serviço só pode utilizar uma peça pertencente ao mesmo cliente do pedido.

O frontend filtra as opções para melhorar a experiência do usuário, mas a regra também é validada pelo backend.

### Horas de produção

As horas totais são calculadas no backend:

```text
horasTotais = quantidade × horasUnitarias
```

Dessa forma, o valor persistido não depende de um cálculo enviado pelo frontend.

### Status da Ordem de Serviço

O fluxo considera quatro estados principais:

```text
NAO_INICIADA
      ↓
EM_ANDAMENTO
      ↓
CONCLUIDA
```

Além do estado:

```text
CANCELADA
```

Algumas regras aplicadas:

- `NAO_INICIADA` não possui setor atual nem data real de entrega;
- `EM_ANDAMENTO` exige um setor produtivo;
- `CONCLUIDA` define automaticamente o setor como `LIBERADO`;
- na primeira conclusão, a data real de entrega é registrada automaticamente;
- uma data real de entrega pode posteriormente ser corrigida em uma OS já concluída;
- ao reabrir uma OS, a data real de entrega é removida;
- `CANCELADA` não possui setor atual nem data real de entrega.

### RNC e devolução

O sistema também mantém consistência entre:

- indicação de RNC e sua respectiva data;
- indicação de devolução e sua respectiva data.

---

## 📊 Indicadores

Os indicadores do dashboard são calculados a partir dos dados operacionais do sistema.

Entre eles estão:

### Ordens pendentes

Ordens ainda abertas considerando o período selecionado.

### Entregas previstas

Ordens cuja data solicitada pertence ao mês selecionado.

### Índice de atraso

Considera ordens entregues depois da data solicitada e ordens ainda abertas após o prazo.

### Índice de RNC

Percentual das entregas realizadas no período que possuem registro de RNC.

### Índice de devolução

Percentual das entregas realizadas no período que possuem registro de devolução.

### Entregas prioritárias

Exibe ordens abertas com vencimento próximo ou já atrasadas.

---

## 🔎 Filtros e paginação

As principais listagens possuem:

- pesquisa;
- filtros específicos por entidade;
- ordenação;
- paginação de 10 itens por página;
- tratamento para pesquisas sem resultados.

Na versão atual, filtros e paginação são realizados no frontend.

---

## 🛡️ Validações e tratamento de erros

O backend realiza validações como:

- campos obrigatórios;
- strings vazias;
- normalização com `trim()`;
- IDs inválidos;
- enums inválidos;
- relacionamentos inexistentes;
- conflitos de unicidade;
- combinações inválidas de estados.

Os controllers diferenciam respostas como:

```text
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

No frontend, os principais formulários também possuem:

- feedback de erro;
- estados de carregamento;
- bloqueio de envios duplicados;
- tratamento de falhas de conexão.

---

## 📁 Estrutura do projeto

```text
controle-producao-mvp/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── server.ts
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── App.tsx
│       └── main.tsx
│
├── docs/
│   └── screenshots/
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Executando localmente

### Pré-requisitos

- Node.js
- npm
- Docker
- Docker Compose

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd controle-producao-mvp
```

### 2. Inicie o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

### 3. Configure o backend

```bash
cd backend
npm install
```

Crie o arquivo:

```text
backend/.env
```

Exemplo para desenvolvimento local:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/production_control?schema=public"
```

> O `.env` não deve ser versionado. Utilize apenas suas próprias credenciais locais.

### 4. Configure o Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Execute o backend

```bash
npm run dev
```

A API ficará disponível, por padrão, em:

```text
http://localhost:3001
```

### 6. Execute o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite normalmente disponibilizará a aplicação em:

```text
http://localhost:5173
```

> Na versão atual, a URL da API ainda está configurada diretamente no frontend como `http://localhost:3001`.

---

## 🗺️ Próximos passos

A versão **v1.1.0** representa o estado atual do MVP.

Algumas evoluções planejadas são:

- 🔐 autenticação com JWT;
- 🔒 proteção de rotas;
- 👤 controle de acesso por usuário;
- 🧪 testes automatizados;
- 🌐 configuração da URL da API por variável de ambiente;
- 📄 paginação server-side;
- 🚀 deploy da aplicação.

---

## 📚 Aprendizados

O projeto foi desenvolvido como uma aplicação prática para consolidar conhecimentos de desenvolvimento full stack.

Durante seu desenvolvimento foram trabalhados conceitos como:

- modelagem de um domínio baseado em um problema real;
- construção de APIs REST;
- separação entre Controller, Service e Repository;
- modelagem relacional com PostgreSQL;
- Prisma ORM e migrations;
- regras de negócio;
- integração entre frontend e backend;
- React com TypeScript;
- gerenciamento de estados e formulários;
- tratamento de erros;
- filtros e paginação;
- construção de indicadores a partir de dados operacionais.

O objetivo não foi apenas implementar operações CRUD, mas construir uma aplicação com **relações, regras e indicadores derivados de um processo produtivo real**.

---

## 👨‍💻 Autor

**Marcus Nascimento**

GitHub: [MarcusVRDN](https://github.com/MarcusVRDN)
