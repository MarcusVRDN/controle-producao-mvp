# Regras de Negócio

## Clientes

Clientes representam as empresas atendidas pelo sistema.

Peças e pedidos são vinculados a um cliente.

## Peças

Cada peça pertence a um cliente.

Uma peça possui informações como:

- código;
- descrição;
- material;
- tratamento térmico;
- tratamento superficial;
- terceirização;
- observações.

## Pedidos

Cada pedido pertence a um cliente.

Os pedidos são utilizados posteriormente na criação das ordens de serviço.

## Ordens de Serviço

Uma ordem de serviço relaciona um pedido a uma peça.

A peça e o pedido utilizados na ordem de serviço devem pertencer ao mesmo
cliente.

A ordem possui informações relacionadas ao acompanhamento da produção, como:

- número;
- quantidade;
- data de entrega solicitada;
- status;
- setor atual;
- informações de qualidade.

## Fluxo de produção

O setor atual representa onde a ordem se encontra no processo produtivo.

Quando uma ordem é concluída:

- o status passa para `CONCLUIDA`;
- o setor atual passa para `LIBERADO`;
- a data real de entrega é registrada.

## Indicadores

O dashboard utiliza os dados das ordens de serviço para acompanhar indicadores
da produção, incluindo:

- ordens pendentes;
- entregas previstas;
- entregas realizadas;
- atrasos;
- RNC;
- devoluções;
- próximas entregas.