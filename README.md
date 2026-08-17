# 🏭 Controle de Produção

Aplicação web full stack para centralizar o acompanhamento de **clientes, peças, pedidos e ordens de serviço** em um fluxo de produção industrial.

O projeto foi desenvolvido a partir de problemas encontrados em ambientes produtivos, onde informações importantes muitas vezes ficam distribuídas entre planilhas, anotações e controles separados.

A aplicação reúne esses dados em uma única interface, permitindo acompanhar o andamento da produção, consultar indicadores e manter a rastreabilidade básica das ordens de serviço.

> **Status:** MVP funcional  
> **Autenticação:** JWT  
> **Frontend:** React + TypeScript  
> **Backend:** Node.js + Express + TypeScript  
> **Banco de dados:** PostgreSQL

---

## 📸 Screenshots

### 📊 Dashboard

O dashboard apresenta uma visão geral da produção, incluindo entregas, pendências, atrasos e indicadores de qualidade.

![Dashboard](./docs/tela-dashboard1.png)

![Dashboard - Indicadores](./docs/tela-dashboard2.png)

### 🏭 Ordens de Serviço

A listagem permite pesquisar, filtrar e acompanhar rapidamente o status e o setor atual das ordens de serviço.

![Ordens de Serviço](./docs/tela-ordem-servico.png)

### 📝 Cadastro de Ordem de Serviço

![Formulário de Ordem de Serviço](./docs/tela-ordem-servico-form.png)

<details>
<summary>📷 Ver outras telas</summary>

### 👥 Clientes

![Clientes](./docs/tela-clientes.png)

### ⚙️ Peças

![Peças](./docs/tela-pecas.png)

### 📦 Pedidos

![Pedidos](./docs/tela-pedidos.png)

### 🔐 Login

![Login](./docs/tela-login.png)

</details>

---

## ✨ Funcionalidades

### 🔐 Autenticação

- Cadastro de usuário
- Login
- Autenticação utilizando JWT
- Proteção das rotas da aplicação
- Envio automático do token nas requisições autenticadas

### 👥 Clientes

- Cadastro
- Listagem
- Visualização
- Edição
- Pesquisa
- Controle de clientes ativos

### ⚙️ Peças

- Cadastro
- Listagem
- Visualização
- Edição
- Associação da peça a um cliente
- Pesquisa e filtros

### 📦 Pedidos

- Cadastro
- Listagem
- Visualização
- Edição
- Associação do pedido a um cliente
- Controle de status
- Pesquisa, filtros e ordenação
- Paginação

### 🏭 Ordens de Serviço

- Cadastro
- Listagem
- Visualização
- Edição
- Associação entre pedido e peça
- Controle de quantidade e horas de produção
- Controle da data de entrega solicitada
- Registro da data real de entrega
- Controle de status
- Acompanhamento do setor atual
- Registro de RNC
- Registro de devolução
- Alteração rápida de status e setor pela listagem
- Pesquisa por número ou código da peça
- Filtros por cliente, status e setor
- Ordenação
- Paginação

---

## 📊 Dashboard

O dashboard consolida informações das ordens de serviço para facilitar o acompanhamento da produção.

Entre os indicadores apresentados estão:

- ordens pendentes;
- entregas previstas no mês;
- entregas realizadas;
- índice de atrasos;
- índice de RNC;
- índice de devoluções;
- próximas entregas.

Os indicadores são calculados a partir dos dados cadastrados nas ordens de serviço e permitem visualizar rapidamente a situação atual da produção.

---

## 📋 Regras de Negócio

Algumas das principais regras implementadas no sistema:

- uma peça pertence a um cliente;
- um pedido pertence a um cliente;
- uma ordem de serviço relaciona um pedido e uma peça;
- pedido e peça utilizados em uma ordem de serviço devem pertencer ao mesmo cliente;
- ordens concluídas recebem uma data real de entrega;
- ao concluir uma ordem, seu setor atual passa para `LIBERADO`;
- RNC e devoluções podem ser registrados para acompanhamento dos indicadores de qualidade.

A documentação mais detalhada das regras de negócio está disponível em:

[`docs/regras-negocio.md`](./docs/regras-negocio.md)

---

## 🏗️ Arquitetura

O projeto é dividido em frontend, backend e banco de dados.

No backend, foi utilizada uma separação em camadas:

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
Prisma ORM
   ↓
PostgreSQL
```

### Controller

Responsável por receber as requisições HTTP, encaminhar os dados para a camada de serviço e retornar as respostas da API.

### Service

Concentra as regras de negócio e validações da aplicação.

### Repository

Responsável pelo acesso e persistência dos dados através do Prisma ORM.

Uma descrição mais detalhada da arquitetura está disponível em:

[`docs/arquitetura.md`](./docs/arquitetura.md)

---

## 🛠️ Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- JWT
- Prisma ORM

### Banco de Dados

- PostgreSQL

### Ferramentas

- Git
- GitHub
- VS Code
- Prisma Studio

---

## 📁 Estrutura do Projeto

```text
controle-producao-mvp/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── server.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.tsx
│
├── docs/
│   ├── arquitetura.md
│   ├── regras-negocio.md
│   ├── tela-clientes.png
│   ├── tela-dashboard1.png
│   ├── tela-dashboard2.png
│   ├── tela-login.png
│   ├── tela-ordem-servico-form.png
│   ├── tela-ordem-servico.png
│   ├── tela-pecas.png
│   └── tela-pedidos.png
│
└── README.md
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, tenha instalado:

- Node.js
- PostgreSQL
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/MarcusVRDN/controle-producao-mvp.git
```

Entre na pasta do projeto:

```bash
cd controle-producao-mvp
```

### 2. Configure o backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `backend` com as variáveis necessárias:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO"
JWT_SECRET="sua_chave_secreta"
```

> ⚠️ O arquivo `.env` contém informações sensíveis e não deve ser enviado para o repositório.

Execute as migrations:

```bash
npx prisma migrate dev
```

Opcionalmente, popule o banco com dados demonstrativos:

```bash
npx prisma db seed
```

Inicie o backend:

```bash
npm run dev
```

Por padrão, a API será executada na porta `3001`.

### 3. Configure o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

Abra no navegador o endereço exibido pelo Vite.

---

## 🌱 Dados Demonstrativos

O projeto possui um seed para facilitar testes e demonstrações locais.

O seed cria dados relacionados de clientes, peças, pedidos e ordens de serviço, permitindo visualizar as principais funcionalidades e indicadores do sistema sem a necessidade de realizar todos os cadastros manualmente.

Para popular o banco:

```bash
npx prisma db seed
```

Caso queira recriar completamente o banco de desenvolvimento:

```bash
npx prisma migrate reset
npx prisma db seed
```

> ⚠️ O comando `prisma migrate reset` remove os dados existentes. Utilize-o apenas em ambiente de desenvolvimento.

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido como um **MVP de controle de produção**, com o objetivo de aplicar conhecimentos de desenvolvimento full stack na resolução de um problema próximo de um cenário industrial real.

A proposta surgiu da necessidade de centralizar informações que normalmente podem estar distribuídas entre planilhas, anotações e diferentes controles utilizados durante o acompanhamento da produção.

Durante o desenvolvimento foram trabalhados conceitos como:

- modelagem de banco de dados;
- construção de APIs REST;
- separação de responsabilidades no backend;
- regras de negócio;
- autenticação com JWT;
- relacionamentos entre entidades;
- validação de dados;
- tratamento de erros;
- desenvolvimento de interfaces com React;
- filtros, pesquisa, ordenação e paginação;
- construção de indicadores;
- integração entre frontend e backend.

---

## 🔮 Próximas Melhorias

O MVP está funcional, mas existem possibilidades de evolução, como:

- refinamento da experiência de alteração de status das ordens de serviço;
- melhorias de responsividade;
- implementação de testes automatizados;
- evolução da estratégia de autenticação;
- níveis de acesso e permissões;
- logs e monitoramento;
- novos indicadores de produção;
- geração de relatórios;
- melhorias de UX e acessibilidade.

---

## 👨‍💻 Autor

**Marcus Nascimento**

Estudante de Desenvolvimento de Software Multiplataforma — FATEC.

Projeto desenvolvido para estudo, portfólio e aplicação prática de desenvolvimento full stack.
