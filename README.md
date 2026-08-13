# 🏭 Controle de Produção

Sistema web full stack desenvolvido para centralizar e facilitar o gerenciamento de processos de produção industrial.

O projeto surgiu a partir da observação de **processos reais de controle de produção**, com o objetivo de organizar informações relacionadas a clientes, peças, pedidos e ordens de serviço em uma aplicação centralizada, facilitando o acompanhamento do andamento da produção e a visualização de indicadores.

> 🚧 **Projeto em desenvolvimento**

---

## 📌 Sobre o projeto

Em ambientes de produção, informações sobre pedidos, peças e ordens de serviço podem estar distribuídas entre planilhas, anotações e diferentes controles internos.

O **Controle de Produção** foi desenvolvido como uma proposta de centralização dessas informações.

A aplicação permite cadastrar e relacionar clientes, peças, pedidos e ordens de serviço, além de acompanhar o andamento da produção através do status e do setor atual de cada ordem.

O sistema também possui um dashboard que reúne indicadores para fornecer uma visão geral da situação da produção.

Além da aplicação prática, o projeto é utilizado para aplicar conceitos de desenvolvimento full stack, arquitetura de software, modelagem de banco de dados relacional e integração entre frontend e backend.

---

## ✨ Funcionalidades

### 👥 Clientes

* Cadastro de clientes;
* Consulta de clientes cadastrados;
* Edição de informações;
* Exclusão de registros.

### ⚙️ Peças

* Cadastro de peças;
* Consulta de peças;
* Edição de informações;
* Exclusão de registros;
* Associação das peças às demais entidades do sistema.

### 📦 Pedidos

* Cadastro de pedidos;
* Consulta de pedidos;
* Edição de informações;
* Exclusão de registros;
* Associação dos pedidos aos clientes;
* Acompanhamento do status do pedido.

### 📋 Ordens de Serviço

* Cadastro de ordens de serviço;
* Consulta das ordens cadastradas;
* Edição de informações;
* Exclusão de registros;
* Associação com pedidos e peças;
* Acompanhamento do status da produção;
* Registro do setor atual da ordem de serviço.

### 📊 Dashboard

* Indicadores gerais da produção;
* Visualização da situação das ordens de serviço;
* Representação dos dados através de gráficos;
* Visão resumida do andamento da produção.

### 🔎 Pesquisa, filtros e paginação

> 🚧 **Em desenvolvimento**

A aplicação está sendo aprimorada com recursos de pesquisa, filtragem e paginação para facilitar a utilização do sistema conforme o volume de registros aumenta.

---

## 🛠️ Tecnologias utilizadas

### Frontend

* **React** — construção da interface;
* **TypeScript** — tipagem estática;
* **Vite** — ambiente de desenvolvimento e build;
* **Tailwind CSS** — estilização;
* **React Router** — navegação entre páginas;
* **Recharts** — construção dos gráficos do dashboard;
* **Lucide React** — ícones da interface.

### Backend

* **Node.js** — ambiente de execução;
* **Express** — construção da API REST;
* **TypeScript** — tipagem e organização do código;
* **Prisma ORM** — acesso e manipulação dos dados.

### Banco de dados e infraestrutura

* **PostgreSQL** — banco de dados relacional;
* **Docker** — execução do banco em ambiente isolado;
* **Docker Compose** — configuração do ambiente do banco de dados.

---

## 🏗️ Arquitetura do backend

O backend foi organizado utilizando uma arquitetura em camadas, separando as responsabilidades relacionadas à comunicação HTTP, regras de negócio e acesso aos dados.

```text id="ux2gza"
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

### Routes

Responsáveis pela definição dos endpoints disponíveis na API e pelo direcionamento das requisições para os controllers.

### Controllers

Recebem as requisições HTTP, encaminham os dados para a camada de serviço e retornam as respostas apropriadas.

### Services

Concentram as regras de negócio da aplicação, mantendo-as separadas da camada HTTP e do acesso direto ao banco de dados.

### Repositories

Responsáveis pelas operações de persistência e consulta dos dados.

### Prisma ORM

Realiza a comunicação entre os repositories e o banco de dados PostgreSQL.

Essa separação busca manter o código organizado e facilitar sua manutenção e evolução.

---

## 📂 Estrutura do projeto

O projeto possui frontend e backend separados dentro do mesmo repositório:

```text id="lsbzdk"
controle-producao-mvp/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

### Backend

Responsável pela:

* API REST;
* Implementação das regras de negócio;
* Validação e processamento dos dados;
* Comunicação com o banco de dados.

### Frontend

Responsável pela:

* Interface da aplicação;
* Navegação entre as páginas;
* Formulários;
* Exibição dos dados;
* Comunicação com a API;
* Dashboard e visualização dos indicadores.

---

## 🗃️ Domínio da aplicação

O sistema foi modelado em torno das principais informações necessárias para acompanhar o processo produtivo.

### Cliente

Representa o cliente responsável por solicitar os serviços de produção.

### Peça

Representa o item relacionado ao processo produtivo.

### Pedido

Representa uma solicitação realizada por um cliente e reúne as informações necessárias para organizar a produção.

### Ordem de Serviço

Representa a execução e o acompanhamento do processo produtivo.

A ordem de serviço possui informações que permitem identificar sua situação atual e em qual setor da produção ela se encontra.

---

## 🔄 Fluxo simplificado

De forma simplificada, as entidades participam do seguinte fluxo:

```text id="0ppyyv"
Cliente
   │
   ▼
Pedido
   │
   ▼
Peça / Ordem de Serviço
   │
   ▼
Processo de Produção
   │
   ├── Setor atual
   │
   └── Status
```

Com isso, é possível acompanhar desde a solicitação do cliente até o andamento das ordens dentro da produção.

---

## 📊 Dashboard

O dashboard foi desenvolvido para fornecer uma visão resumida das informações registradas no sistema.

A proposta é permitir que o usuário identifique rapidamente a situação atual da produção através de indicadores e gráficos, sem precisar consultar individualmente cada ordem de serviço.

### Screenshots

> 📷 Screenshots serão adicionados após a finalização da interface do MVP.

<!--

Crie posteriormente a pasta:

docs/images/

E adicione, por exemplo:

![Dashboard](./docs/images/dashboard.png)

![Ordens de Serviço](./docs/images/ordens-servico.png)

-->

---

## 🐳 Banco de dados com Docker

O PostgreSQL utilizado durante o desenvolvimento é executado através de um container Docker.

Isso permite criar um ambiente de desenvolvimento reproduzível sem depender de uma instalação manual do PostgreSQL na máquina.

O Docker Compose é responsável pela configuração e inicialização do banco de dados.

Os dados são mantidos através de um volume Docker, evitando que sejam perdidos sempre que o container for encerrado.

---

## 🚀 Como executar

### Pré-requisitos

Antes de iniciar, tenha instalado:

* Git;
* Node.js;
* npm;
* Docker;
* Docker Compose.

### 1. Clone o repositório

```bash id="1z32jg"
git clone https://github.com/MarcusVRDN/controle-producao-mvp.git
```

Entre no diretório:

```bash id="j0wjlk"
cd controle-producao-mvp
```

### 2. Inicie o banco de dados

Na raiz do projeto:

```bash id="7p2l9q"
docker compose up -d
```

O Docker criará e iniciará o container utilizado pelo PostgreSQL.

### 3. Instale as dependências do backend

```bash id="25cp8d"
cd backend
npm install
```

### 4. Configure as variáveis de ambiente

As variáveis de ambiente utilizadas pelo backend devem ser configuradas localmente.

O arquivo `.env` **não é versionado no repositório**, evitando a exposição de informações sensíveis.

> Um arquivo `.env.example` poderá ser utilizado como referência para indicar as variáveis necessárias sem expor seus valores reais.

### 5. Execute o backend

```bash id="92pdz6"
npm run dev
```

### 6. Execute o frontend

Em outro terminal, a partir da raiz do projeto:

```bash id="gb8p20"
cd frontend
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local utilizado para acessar a aplicação.

---

## 🔐 Variáveis de ambiente

Informações sensíveis e configurações específicas do ambiente não devem ser versionadas.

A estrutura recomendada é:

```text id="8hd84i"
backend/
├── .env           # configuração local (não versionada)
└── .env.example   # exemplo das variáveis necessárias
```

O `.env.example` contém apenas os nomes ou valores de exemplo das variáveis necessárias para executar o projeto.

---

## 🚧 Status do projeto

O projeto encontra-se atualmente em desenvolvimento.

### ✅ Implementado

* CRUD de clientes;
* CRUD de peças;
* CRUD de pedidos;
* CRUD de ordens de serviço;
* Relacionamento entre as entidades;
* Acompanhamento de status;
* Acompanhamento do setor atual das ordens;
* Integração frontend/backend;
* API REST;
* Banco de dados PostgreSQL;
* Prisma ORM;
* Ambiente PostgreSQL com Docker;
* Dashboard;
* Indicadores e gráficos.

### 🚧 Em desenvolvimento

* Pesquisa;
* Filtros;
* Paginação.

### 📋 Próximos passos

* Revisão das validações;
* Melhorias no tratamento de erros;
* Autenticação com JWT;
* Controle de acesso;
* Ajustes finais da interface;
* Deploy da aplicação.

---

## 🗺️ Roadmap

A evolução planejada do projeto está dividida em etapas.

### MVP

Implementação das principais funcionalidades necessárias para cadastrar e acompanhar os dados da produção.

### Pesquisa, filtros e paginação

Melhoria da consulta dos dados e preparação da aplicação para lidar melhor com um volume maior de registros.

### Autenticação

Implementação de autenticação utilizando JWT e proteção das rotas que exigem acesso autorizado.

### Qualidade

Evolução das validações, tratamento de erros e implementação de testes automatizados.

### Deploy

Disponibilização de uma versão online da aplicação para demonstração.

---

## 🔮 Possíveis evoluções futuras

Após a conclusão das funcionalidades principais, o sistema poderá ser expandido com recursos como:

* Diferentes níveis de acesso;
* Histórico de alterações;
* Registro das movimentações das ordens de serviço;
* Indicadores adicionais de produtividade;
* Identificação de gargalos;
* Relatórios;
* Exportação de dados;
* Alertas para pedidos atrasados;
* Filtros avançados no dashboard;
* Testes automatizados;
* Logs e auditoria.

Essas funcionalidades não fazem parte necessariamente do escopo atual do MVP, mas representam possibilidades de evolução do sistema.

---

## 🎯 Objetivos técnicos

Além de representar uma solução para um cenário de controle de produção, o projeto é utilizado para aplicar e desenvolver conhecimentos relacionados a:

* Desenvolvimento full stack;
* React;
* Node.js;
* TypeScript;
* Desenvolvimento de APIs REST;
* Modelagem de banco de dados relacional;
* PostgreSQL;
* Prisma ORM;
* Arquitetura em camadas;
* Separação de responsabilidades;
* Implementação de regras de negócio;
* Integração frontend/backend;
* Docker;
* Git e versionamento de código.

---

## 💡 Motivação

Este projeto não foi criado apenas como um exercício de CRUD.

A ideia surgiu da experiência com processos de controle de produção e da percepção de que informações importantes para o acompanhamento da produção podem se tornar difíceis de administrar quando estão distribuídas entre diferentes controles.

Por isso, o projeto busca aplicar desenvolvimento de software a um **problema de domínio real**, transformando processos observados no ambiente produtivo em regras, entidades e funcionalidades de uma aplicação web.

---

## 👨‍💻 Autor

Desenvolvido por **Marcus Nascimento**.

GitHub: [MarcusVRDN](https://github.com/MarcusVRDN)
