# Arquitetura

## Visão geral

O Controle de Produção é uma aplicação web full stack composta por frontend,
backend e banco de dados PostgreSQL.

## Frontend

Tecnologias:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

O frontend é responsável pela interface do usuário, navegação, formulários,
dashboard e comunicação com a API.

As requisições para rotas protegidas são realizadas através de `apiFetch`,
que adiciona o token JWT ao header `Authorization`.

## Backend

Tecnologias:

- Node.js
- Express
- TypeScript
- Prisma ORM

O backend segue a separação:

Controller → Service → Repository

### Controller

Recebe as requisições HTTP e devolve as respostas.

### Service

Contém validações e regras de negócio.

### Repository

Responsável pelo acesso ao banco de dados através do Prisma.

## Banco de dados

Banco utilizado:

- PostgreSQL

Principais entidades:

- User
- Cliente
- Peça
- Pedido
- Ordem de Serviço

## Autenticação

A autenticação utiliza JWT.

Fluxo:

1. O usuário realiza login.
2. O backend valida as credenciais.
3. Um token JWT é gerado.
4. O frontend armazena o token.
5. O `apiFetch` envia o token nas requisições protegidas.
6. O middleware do backend valida o token antes de permitir acesso às rotas.