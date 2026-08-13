import { Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Cliente = {
  id: number;
  nome: string;
};

type Peca = {
  id: number;
  codigo: string;
};

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
};

type OrdemServico = {
  id: number;
  numero: number;
  pedidoId: number;
  pecaId: number;
  quantidade: number;
  dataEntregaSolicitada: string;
  status: string;
  setorAtual: string | null;
};

function OrdensServico() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);

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

  const [pecas, setPecas] = useState<Peca[]>([]);
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

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
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

  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  useEffect(() => {
    async function buscarOrdensServico() {
      const response = await fetch("http://localhost:3001/ordensServico");
      if (response.ok) {
        const ordensServicoApi = await response.json();
        setOrdensServico(ordensServicoApi);
      } else {
        console.error("Erro ao buscar ordens de serviço");
      }
    }
    buscarOrdensServico();
  }, []);

  const statusOrdemServico = [
    { valor: "NAO_INICIADA", texto: "Não iniciada" },
    { valor: "EM_ANDAMENTO", texto: "Em andamento" },
    { valor: "CONCLUIDA", texto: "Concluída" },
    { valor: "CANCELADA", texto: "Cancelada" },
  ];

  const setores = [
    { value: "TORNO", label: "Torno" },
    { value: "FRESA", label: "Fresa" },
    { value: "RETIFICA", label: "Retífica" },
    { value: "CENTRO_USINAGEM", label: "Centro de usinagem" },
    { value: "TORNO_CNC", label: "Torno CNC" },
    { value: "MANDRILHADORA", label: "Mandrilhadora" },
    { value: "AJUSTAGEM", label: "Ajustagem" },
    { value: "ROSQUEADEIRA", label: "Rosqueadeira" },
    { value: "QUALIDADE", label: "Qualidade" },
    { value: "LIBERADO", label: "Liberado" },
  ];

  async function atualizarOrdemServico(
    id: number,
    dados: {
      status?: string;
      setorAtual?: string | null;
    },
  ) {
    try {
      console.log("Dados enviados:", dados);

      const response = await fetch(
        `http://localhost:3001/ordensServico/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        },
      );

      if (!response.ok) {
        const erro = await response.json();

        console.error("Erro retornado pelo backend:", erro);

        throw new Error("Erro ao atualizar ordem de serviço");
      }

      const ordemAtualizada = await response.json();

      setOrdensServico((ordensAtuais) =>
        ordensAtuais.map((ordem) =>
          ordem.id === id ? ordemAtualizada : ordem,
        ),
      );
    } catch (error) {
      console.error(error);

      alert("Não foi possível atualizar a ordem de serviço");
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Ordens de Serviço</h1>

        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          onClick={() => navigate("/ordem-servico/novo")}
        >
          <Plus size={18} />
          Adicionar Ordem de Serviço
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-600">
        <table className="w-full border-collapse bg-slate-200 text-left text-sm">
          <thead className="bg-slate-300">
            <tr>
              <th className="border-b border-slate-600 p-3">Numero</th>
              <th className="border-b border-slate-600 p-3">Cliente</th>
              <th className="border-b border-slate-600 p-3">Pedido</th>
              <th className="border-b border-slate-600 p-3">Peça</th>
              <th className="border-b border-slate-600 p-3">Quantidade</th>
              <th className="border-b border-slate-600 p-3">Data de entrega</th>
              <th className="border-b border-slate-600 p-3">Status</th>
              <th className="border-b border-slate-600 p-3">Setor atual</th>
              <th className="border-b border-slate-600 p-3 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {ordensServico.map((ordemServico) => (
              <tr
                key={ordemServico.id}
                className="transition hover:bg-slate-300"
                onClick={() => navigate(`./view/${ordemServico.id}`)}
              >
                <td className="border-b border-slate-400 p-3">
                  {ordemServico.numero}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {clientes.find(
                    (cliente) =>
                      cliente.id ===
                      pedidos.find(
                        (pedido) => pedido.id === ordemServico.pedidoId,
                      )?.clienteId,
                  )?.nome ?? "Cliente não encontrado"}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {pedidos.find((pedido) => pedido.id === ordemServico.pedidoId)
                    ?.codigo ?? "Pedido não encontrado"}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {pecas.find((peca) => peca.id === ordemServico.pecaId)
                    ?.codigo ?? "Peça não encontrada"}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.quantidade}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {new Date(
                    ordemServico.dataEntregaSolicitada,
                  ).toLocaleDateString("pt-BR")}
                </td>

                <td className="border-b border-slate-400 p-3">
                  <select
                    value={ordemServico.status}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    onChange={(event) =>
                      atualizarOrdemServico(ordemServico.id, {
                        status: event.target.value,
                      })
                    }
                    className="rounded-md border border-slate-400 bg-slate-100 px-2 py-1 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOrdemServico.map((status) => (
                      <option key={status.valor} value={status.valor}>
                        {status.texto}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border-b border-slate-400 p-3">
                  <select
                    value={ordemServico.setorAtual ?? ""}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    onChange={(event) =>
                      atualizarOrdemServico(ordemServico.id, {
                        setorAtual: event.target.value || null,
                      })
                    }
                    className="rounded-md border border-slate-400 bg-slate-100 px-2 py-1 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sem setor</option>

                    {setores.map((setor) => (
                      <option key={setor.value} value={setor.value}>
                        {setor.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar ordem de serviço"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/ordens-servico/editar/${ordemServico.id}`);
                      }}
                    >
                      <Pencil size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrdensServico;
