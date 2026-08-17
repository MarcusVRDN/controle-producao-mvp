import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPedidoStatusLabel, pedidoStatusOptions } from "./pedidoOptions";
import { apiFetch } from "../services/api";

type Cliente = {
  id: number;
  nome: string;
};

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
  observacao: string | null;
  status: string;
};

function Pedidos() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("TODOS");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [ordenacao, setOrdenacao] = useState("CRESCENTE");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    async function carregarDados() {
      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const [responseClientes, responsePedidos] = await Promise.all([
          apiFetch("/clientes"),
          apiFetch("/pedidos"),
        ]);

        if (!responseClientes.ok || !responsePedidos.ok) {
          throw new Error("Não foi possível carregar os pedidos.");
        }

        const [clientesApi, pedidosApi] = await Promise.all([
          responseClientes.json(),
          responsePedidos.json(),
        ]);

        setClientes(clientesApi);
        setPedidos(pedidosApi);
      } catch (error) {
        console.error(error);
        setErroCarregamento("Não foi possível carregar a lista de pedidos.");
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, []);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termo = pesquisa.trim().toLowerCase();
    const correspondePesquisa =
      termo === "" || pedido.codigo.toLowerCase().includes(termo);
    const correspondeCliente =
      filtroCliente === "TODOS" || Number(filtroCliente) === pedido.clienteId;
    const correspondeStatus =
      filtroStatus === "TODOS" || pedido.status === filtroStatus;

    return correspondePesquisa && correspondeCliente && correspondeStatus;
  });

  const pedidosOrdenados = [...pedidosFiltrados].sort((a, b) => {
    if (ordenacao === "CRESCENTE") {
      return a.codigo.localeCompare(b.codigo);
    }

    return b.codigo.localeCompare(a.codigo);
  });

  const itensPorPagina = 10;
  const totalPaginas = Math.max(1, Math.ceil(pedidosOrdenados.length / itensPorPagina));
  const paginaExibida = Math.min(paginaAtual, totalPaginas);
  const indiceInicial = (paginaExibida - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const pedidosPaginados = pedidosOrdenados.slice(indiceInicial, indiceFinal);

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando pedidos...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Pedidos</h1>

        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          onClick={() => navigate("/pedidos/novo")}
        >
          <Plus size={18} />
          Adicionar Pedido
        </button>
      </div>

      {erroCarregamento ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroCarregamento}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
            placeholder="Pesquisar por código..."
          value={pesquisa}
          onChange={(event) => {
            setPesquisa(event.target.value);
            setPaginaAtual(1);
          }}
          className="w-full max-w-md rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filtroStatus}
          onChange={(event) => {
            setFiltroStatus(event.target.value);
            setPaginaAtual(1);
          }}
          className="rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900"
        >
          <option value="TODOS">Todos os status</option>

          {pedidoStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={filtroCliente}
          onChange={(event) => {
            setFiltroCliente(event.target.value);
            setPaginaAtual(1);
          }}
          className="rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900"
        >
          <option value="TODOS">Todos os clientes</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <select
          value={ordenacao}
          onChange={(event) => {
            setOrdenacao(event.target.value);
            setPaginaAtual(1);
          }}
          className="rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900"
        >
          <option value="CRESCENTE">Crescente</option>
          <option value="DECRESCENTE">Decrescente</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-600">
        <table className="w-full border-collapse bg-slate-200 text-left text-sm">
          <thead className="bg-slate-300">
            <tr>
              <th className="border-b border-slate-600 p-3">Código</th>
              <th className="border-b border-slate-600 p-3">Cliente</th>
              <th className="border-b border-slate-600 p-3">Observação</th>
              <th className="border-b border-slate-600 p-3">Status</th>
              <th className="border-b border-slate-600 p-3 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {pedidosPaginados.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-slate-400 p-6 text-center text-slate-700"
                >
                  Nenhum pedido encontrado para os filtros atuais.
                </td>
              </tr>
            ) : null}

            {pedidosPaginados.map((pedido) => (
              <tr
                key={pedido.id}
                className="transition hover:bg-slate-300"
                onClick={() => navigate(`./view/${pedido.id}`)}
              >
                <td className="border-b border-slate-400 p-3">{pedido.codigo}</td>
                <td className="border-b border-slate-400 p-3">
                  {clientes.find((cliente) => cliente.id === pedido.clienteId)?.nome ??
                    "Cliente não encontrado"}
                </td>
                <td className="border-b border-slate-400 p-3">
                  {pedido.observacao ?? "-"}
                </td>
                <td className="border-b border-slate-400 p-3">
                  {getPedidoStatusLabel(pedido.status)}
                </td>
                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar pedido"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/pedidos/editar/${pedido.id}`);
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

        <div className="flex items-center justify-between px-3 py-3">
          <button
            onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
            disabled={paginaExibida === 1}
            className="rounded-md bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm text-slate-300">
            Página {paginaExibida} de {totalPaginas}
          </span>

          <button
            onClick={() =>
              setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))
            }
            disabled={paginaExibida === totalPaginas}
            className="rounded-md bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
          >
            Proxima
          </button>
        </div>
      </div>
    </section>
  );
}

export default Pedidos;
