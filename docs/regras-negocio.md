# 📋 Regras de Negócio

Este documento descreve as principais regras de negócio implementadas no **Controle de Produção**.

O sistema organiza o fluxo produtivo a partir das entidades **Cliente, Peça, Pedido e Ordem de Serviço**, mantendo os relacionamentos necessários para acompanhar a produção e gerar os indicadores apresentados no dashboard.

---

## 👥 Clientes

Clientes representam as empresas atendidas pelo sistema.

Um cliente pode possuir:

- várias peças;
- vários pedidos.

O CNPJ identifica o cliente de forma única no sistema.

Clientes também possuem um campo de controle de atividade, permitindo diferenciar clientes ativos e inativos.

---

## ⚙️ Peças

Cada peça pertence obrigatoriamente a um cliente.

Uma peça possui informações como:

- código;
- descrição;
- material;
- tratamento térmico;
- tratamento superficial;
- terceirização;
- observações.

O código da peça deve ser único dentro de um mesmo cliente.

Isso permite que clientes diferentes possuam peças com o mesmo código sem gerar conflito.

---

## 📦 Pedidos

Cada pedido pertence obrigatoriamente a um cliente.

Um pedido possui:

- código;
- cliente;
- status;
- observação.

O código do pedido deve ser único no sistema.

Os pedidos são posteriormente utilizados na criação das ordens de serviço.

Os status disponíveis são:

- `ABERTO`;
- `EM_ANDAMENTO`;
- `CONCLUIDO`;
- `CANCELADO`.

---

## 🏭 Ordens de Serviço

A Ordem de Serviço representa uma unidade de acompanhamento da produção.

Cada ordem relaciona:

- um pedido;
- uma peça.

A peça e o pedido utilizados na ordem de serviço devem pertencer ao **mesmo cliente**.

Cada ordem possui um número único.

Entre as informações armazenadas estão:

- número;
- pedido;
- peça;
- quantidade;
- horas unitárias;
- horas totais;
- setores;
- setor atual;
- data de entrega solicitada;
- data real de entrega;
- status;
- observações;
- existência de RNC;
- existência de devolução;
- data da RNC;
- data da devolução.

---

## ⏱️ Horas de Produção

Cada ordem possui uma quantidade de peças e uma quantidade de horas unitárias.

As horas totais representam a carga de produção associada à ordem de serviço.

Essas informações permitem registrar a carga necessária para a fabricação do item.

---

## 🔄 Fluxo de Produção

O campo `setorAtual` representa onde a ordem se encontra no processo produtivo.

Os setores disponíveis são:

- `TORNO_MECANICO`;
- `TORNO_CNC`;
- `CENTRO_USINAGEM`;
- `FRESA_CONVENCIONAL`;
- `MANDRILHADORA`;
- `RETIFICA`;
- `ROSQUEADEIRA`;
- `AJUSTAGEM`;
- `SERVICO_EXTERNO`;
- `QUALIDADE`;
- `LIBERADO`.

Os status possíveis de uma ordem de serviço são:

- `NAO_INICIADA`;
- `EM_ANDAMENTO`;
- `CONCLUIDA`;
- `CANCELADA`.

O status e o setor atual podem ser alterados durante o acompanhamento da produção.

---

## ✅ Conclusão de uma Ordem

Quando uma ordem passa para o status `CONCLUIDA` pela primeira vez:

- o status passa para `CONCLUIDA`;
- o setor atual passa automaticamente para `LIBERADO`;
- a data real de entrega é registrada.

Caso uma ordem já concluída seja editada, a data real de entrega pode ser corrigida manualmente.

Caso uma ordem deixe de possuir o status `CONCLUIDA`, a data real de entrega deixa de representar uma conclusão válida e é removida.

---

## ⚠️ Atrasos

Uma ordem concluída é considerada atrasada quando sua data real de entrega é posterior à data de entrega solicitada.

Ordens ainda não concluídas também podem ser consideradas atrasadas quando a data de entrega solicitada já passou.

Essas informações são utilizadas no cálculo do indicador de atrasos apresentado no dashboard.

---

## 🧪 RNC

O sistema permite registrar se uma ordem possui **RNC (Relatório de Não Conformidade)**.

Quando aplicável, também pode ser registrada a data relacionada à RNC.

Esses registros são utilizados para acompanhar ocorrências de qualidade e calcular o respectivo indicador no dashboard.

---

## ↩️ Devoluções

O sistema permite registrar se uma ordem de serviço possui devolução.

Quando aplicável, também pode ser registrada a data da devolução.

Esses dados são utilizados no acompanhamento dos indicadores de qualidade.

---

## 📊 Dashboard

O dashboard consolida informações das ordens de serviço para fornecer uma visão geral da produção.

### Ordens pendentes

Representam ordens ainda abertas que possuem entrega prevista até o final do período analisado.

Ordens pendentes de períodos anteriores continuam sendo consideradas enquanto não forem concluídas ou canceladas.

### Entregas previstas

Representam ordens cuja data de entrega solicitada pertence ao período analisado.

### Entregas realizadas

Representam ordens cuja data real de entrega pertence ao período analisado.

### Índice de atrasos

Considera entregas realizadas após a data solicitada e ordens ainda pendentes cuja data prevista já venceu.

### Índice de RNC

Representa a ocorrência de RNC em relação às entregas realizadas consideradas pelo indicador.

### Índice de devoluções

Representa a ocorrência de devoluções em relação às entregas realizadas consideradas pelo indicador.

### Próximas entregas

Apresenta ordens ainda abertas com entrega próxima, permitindo visualizar antecipadamente os itens que precisam de atenção.

Ordens atrasadas ainda não concluídas também permanecem visíveis para acompanhamento.

---

## 🔗 Relacionamentos

O relacionamento principal entre as entidades pode ser representado da seguinte forma:

```text
Cliente
 ├── Peças
 │
 └── Pedidos
       │
       └── Ordens de Serviço
                │
                └── Peça
```

A validação entre pedido, peça e cliente garante que uma ordem de serviço não relacione dados pertencentes a clientes diferentes.