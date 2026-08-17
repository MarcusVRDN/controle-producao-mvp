# 🏗️ Arquitetura

## 📌 Visão geral

O **Controle de Produção** é uma aplicação web full stack composta por frontend, backend e banco de dados PostgreSQL.

A aplicação utiliza uma arquitetura cliente-servidor, na qual o frontend se comunica com uma API REST responsável pelas regras de negócio, autenticação e persistência dos dados.

O fluxo geral da aplicação é:

Frontend → API REST → Prisma ORM → PostgreSQL

---

## 🖥️ Frontend

### Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

O frontend é responsável pela interface do usuário, navegação, formulários, dashboard e comunicação com a API.

As principais funcionalidades da interface incluem:

- dashboard com indicadores de produção;
- gerenciamento de clientes;
- gerenciamento de peças;
- gerenciamento de pedidos;
- gerenciamento de ordens de serviço;
- pesquisa e filtros;
- paginação;
- autenticação;
- proteção de páginas privadas.

### Comunicação com a API

A URL do backend é definida através da variável de ambiente:

```env
VITE_API_URL=
