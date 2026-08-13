import { useEffect, useState } from "react";
import CardMetric from "../components/CardMetric";
import { MoveLeft, MoveRight } from "lucide-react";
import ProximasEntregas from "../components/ProximasEntregas";
import IndicadorPercentual from "../components/IndicadorPercentual";

type OrdemServico = {
  id: number;
  numero: number;
  status: string;
  pedidoId: number;
  pecaId: number;
  dataEntregaSolicitada: string;
  dataEntregaReal: string | null;
  possuiRnc: boolean;
  dataRnc: string | null;
  possuiDevolucao: boolean;
  dataDevolucao: string | null;
};

type Pedido = {
  id: number;
  clienteId: number;
};

type Peca = {
  id: number;
  codigo: string;
};

type Cliente = {
  id: number;
  nome: string;
};

function Dashboard() {
  // Dados usados no dashboard
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Mês exibido no dashboard.
  // new Date() faz com que o dashboard comece no mês atual.
  const [mesSelecionado, setMesSelecionado] = useState(new Date());

  // Busca clientes
  useEffect(() => {
    async function buscarClientes() {
      const response = await fetch("http://localhost:3001/clientes");

      if (response.ok) {
        const clientesApi = await response.json();
        setClientes(clientesApi);
      } else {
        console.error("Erro ao buscar clientes");
      }
    }

    buscarClientes();
  }, []);

  // Busca peças
  useEffect(() => {
    async function buscarPecas() {
      const response = await fetch("http://localhost:3001/pecas");

      if (response.ok) {
        const pecasApi = await response.json();
        setPecas(pecasApi);
      } else {
        console.error("Erro ao buscar peças");
      }
    }

    buscarPecas();
  }, []);

  // Busca pedidos
  useEffect(() => {
    async function buscarPedidos() {
      const response = await fetch("http://localhost:3001/pedidos");

      if (response.ok) {
        const pedidosApi = await response.json();
        setPedidos(pedidosApi);
      } else {
        console.error("Erro ao buscar pedidos");
      }
    }

    buscarPedidos();
  }, []);

  // Busca ordens de serviço
  useEffect(() => {
    async function buscarOrdensServico() {
      const response = await fetch("http://localhost:3001/ordensServico");

      if (response.ok) {
        const ordensServicoApi = await response.json();
        setOrdensServico(ordensServicoApi);
      } else {
        console.error("Não foi possível buscar ordens de serviço");
      }
    }

    buscarOrdensServico();
  }, []);

  // Converte o mês selecionado para algo como "agosto de 2026"
  const nomeMes = mesSelecionado.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // Último instante do mês selecionado.
  // O dia 0 do próximo mês representa o último dia do mês atual.
  const fimMesSelecionado = new Date(
    mesSelecionado.getFullYear(),
    mesSelecionado.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  /*
    Conta as OS que ainda estão abertas e cuja entrega estava prevista
    até o fim do mês selecionado.

    Dessa forma, uma OS de julho ainda pendente também aparece
    quando navegamos para agosto.
  */
  const ordensPendentes = ordensServico.filter((ordem) => {
    const dataEntrega = new Date(ordem.dataEntregaSolicitada);

    const estaAberta =
      ordem.status === "NAO_INICIADA" || ordem.status === "EM_ANDAMENTO";

    const deveriaTerSidoEntregueAteEsseMes = dataEntrega <= fimMesSelecionado;

    return estaAberta && deveriaTerSidoEntregueAteEsseMes;
  }).length;

  /*
    Conta somente as OS cuja data de entrega solicitada pertence
    exatamente ao mês e ano selecionados.
  */
  const entregasPrevistasDoMes = ordensServico.filter((ordem) => {
    const dataEntrega = new Date(ordem.dataEntregaSolicitada);

    return (
      dataEntrega.getMonth() === mesSelecionado.getMonth() &&
      dataEntrega.getFullYear() === mesSelecionado.getFullYear()
    );
  }).length;

  // Representa o início do dia atual
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Define o limite das entregas prioritárias: hoje + 5 dias
  const limiteEntregas = new Date(hoje);
  limiteEntregas.setDate(hoje.getDate() + 5);

  /*
    Seleciona todas as OS ainda abertas com entrega prevista
    até os próximos 5 dias.

    Não existe uma condição "dataEntrega >= hoje" porque queremos
    incluir também as OS que já estão atrasadas.
  */
  const entregasPrioritarias = ordensServico.filter((ordem) => {
    const dataEntrega = new Date(ordem.dataEntregaSolicitada);
    dataEntrega.setHours(0, 0, 0, 0);

    const estaAberta =
      ordem.status === "NAO_INICIADA" || ordem.status === "EM_ANDAMENTO";

    const dentroDoLimite = dataEntrega <= limiteEntregas;

    return estaAberta && dentroDoLimite;
  });

  /*
    Transforma as Ordens de Serviço no formato que o componente
    ProximasEntregas precisa receber.

    OrdemServico possui apenas pedidoId e pecaId, então usamos:
    
    OS -> Pedido -> Cliente
    OS -> Peça
  */
  const entregasTabela = entregasPrioritarias.map((ordem) => {
    const pedido = pedidos.find((pedido) => pedido.id === ordem.pedidoId);

    const peca = pecas.find((peca) => peca.id === ordem.pecaId);

    const cliente = clientes.find(
      (cliente) => cliente.id === pedido?.clienteId,
    );

    return {
      id: ordem.id,
      numero: ordem.numero,
      dataEntregaSolicitada: ordem.dataEntregaSolicitada,

      // O componente recebe os dados já prontos para exibição
      cliente: cliente?.nome ?? "Cliente não encontrado",
      peca: peca?.codigo ?? "Peça não encontrada",
    };
  });

  // Verifica ordens entregues no mês

  const entregasRealizadasNoMes = ordensServico.filter((ordem) => {
    if (!ordem.dataEntregaReal) {
      return false;
    }

    const dataEntregaReal = new Date(ordem.dataEntregaReal);

    return (
      dataEntregaReal.getMonth() === mesSelecionado.getMonth() &&
      dataEntregaReal.getFullYear() === mesSelecionado.getFullYear()
    );
  });

  // Calcula entregas realizadas no mês
  const totalEntregasRealizadas = entregasRealizadasNoMes.length;

  // Calcula índice de RNC

  const rncDoMes = entregasRealizadasNoMes.filter(
    (ordem) => ordem.possuiRnc,
  ).length;

  const indiceRnc =
    totalEntregasRealizadas > 0
      ? (rncDoMes / totalEntregasRealizadas) * 100
      : 0;

  // Calcula índice de devolução

  const devolucoesDoMes = entregasRealizadasNoMes.filter(
    (ordem) => ordem.possuiDevolucao,
  ).length;

  const indiceDevolucao =
    totalEntregasRealizadas > 0
      ? (devolucoesDoMes / totalEntregasRealizadas) * 100
      : 0;

  // calcula indice de atrasos
  const atrasosDoMes = ordensServico.filter((ordem) => {
    const dataSolicitada = new Date(ordem.dataEntregaSolicitada);
    dataSolicitada.setHours(0, 0, 0, 0);

    const pertenceAoMesSelecionado =
      dataSolicitada.getMonth() === mesSelecionado.getMonth() &&
      dataSolicitada.getFullYear() === mesSelecionado.getFullYear();

    const prazoJaVenceu = dataSolicitada < hoje;

    const foiEntregueAtrasada =
      ordem.dataEntregaReal && new Date(ordem.dataEntregaReal) > dataSolicitada;

    const continuaAtrasada = !ordem.dataEntregaReal && prazoJaVenceu;

    return (
      pertenceAoMesSelecionado && (foiEntregueAtrasada || continuaAtrasada)
    );
  });

  const totalAtrasosDoMes = atrasosDoMes.length;

  const indiceAtraso =
    entregasPrevistasDoMes > 0
      ? (totalAtrasosDoMes / entregasPrevistasDoMes) * 100
      : 0;

  // Volta um mês e fixa o dia em 1 para evitar problemas com meses menores
  function mesAnterior() {
    setMesSelecionado(
      new Date(mesSelecionado.getFullYear(), mesSelecionado.getMonth() - 1, 1),
    );
  }

  // Avança um mês
  function proximoMes() {
    setMesSelecionado(
      new Date(mesSelecionado.getFullYear(), mesSelecionado.getMonth() + 1, 1),
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>

        {/* Navegação entre os meses do dashboard */}
        <div className="flex items-center gap-4">
          <button
            onClick={mesAnterior}
            className="rounded-md bg-slate-700 px-3 py-1 text-white hover:bg-slate-600"
          >
            <MoveLeft />
          </button>

          <p className="min-w-40 text-center text-slate-300">{nomeMes}</p>

          <button
            onClick={proximoMes}
            className="rounded-md bg-slate-700 px-3 py-1 text-white hover:bg-slate-600"
          >
            <MoveRight />
          </button>
        </div>
      </div>

      {/* Indicadores principais */}
      <CardMetric titulo="Ordens pendentes" valor={ordensPendentes} />

      <CardMetric
        titulo="Entregas previstas no mês"
        valor={entregasPrevistasDoMes}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <IndicadorPercentual titulo="Índice de atraso" valor={indiceAtraso} />

        <IndicadorPercentual titulo="Índice de RNC" valor={indiceRnc} />

        <IndicadorPercentual
          titulo="Índice de devolução"
          valor={indiceDevolucao}
        />
      </div>
      {/* Tabela recebe os dados já tratados pelo Dashboard */}
      <ProximasEntregas ordens={entregasTabela} />
    </section>
  );
}

export default Dashboard;
