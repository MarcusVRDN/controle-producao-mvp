import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSetorAtualLabel,
  isSetorProdutivo,
  setorAtualOptions,
  setorProdutivoOptions,
  statusOrdemServicoOptions,
  type StatusOrdemServico,
} from "./ordemServicoOptions";

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
  status: StatusOrdemServico;
  setorAtual: string | null;
};

async function getResponseErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const payload = await response.json();

    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string" &&
      payload.error.trim() !== ""
    ) {
      return payload.error;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

function OrdensServico() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroPatch, setErroPatch] = useState("");
  const [ordensAtualizandoIds, setOrdensAtualizandoIds] = useState<number[]>(
    [],
  );
  const [pesquisa, setPesquisa] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("TODOS");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroSetorAtual, setFiltroSetorAtual] = useState("TODOS");
  const [ordenacao, setOrdenacao] = useState("CRESCENTE");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    async function carregarDados() {
      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const [responseClientes, responsePecas, responsePedidos, responseOrdens] =
          await Promise.all([
            fetch("http://localhost:3001/clientes"),
            fetch("http://localhost:3001/pecas"),
            fetch("http://localhost:3001/pedidos"),
            fetch("http://localhost:3001/ordensServico"),
          ]);

        if (
          !responseClientes.ok ||
          !responsePecas.ok ||
          !responsePedidos.ok ||
          !responseOrdens.ok
        ) {
          throw new Error(
            "Nao foi possivel carregar a listagem de ordens de servico.",
          );
        }

        const [clientesApi, pecasApi, pedidosApi, ordensServicoApi] =
          await Promise.all([
            responseClientes.json(),
            responsePecas.json(),
            responsePedidos.json(),
            responseOrdens.json(),
          ]);

        setClientes(clientesApi);
        setPecas(pecasApi);
        setPedidos(pedidosApi);
        setOrdensServico(ordensServicoApi);
      } catch (error) {
        console.error(error);
        setErroCarregamento(
          "Nao foi possivel carregar os dados da tela de ordens de servico.",
        );
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, []);

  const ordensFiltradas = ordensServico.filter((ordem) => {
    const termo = pesquisa.trim().toLowerCase();
    const pesquisaNumero = ordem.numero.toString();
    const peca = pecas.find((pecaAtual) => pecaAtual.id === ordem.pecaId);
    const pedido = pedidos.find((pedidoAtual) => pedidoAtual.id === ordem.pedidoId);
    const correspondePesquisa =
      termo === "" ||
      pesquisaNumero.toLowerCase().includes(termo) ||
      peca?.codigo.toLowerCase().includes(termo);

    const correspondeCliente =
      filtroCliente === "TODOS" || pedido?.clienteId === Number(filtroCliente);
    const correspondeStatus =
      filtroStatus === "TODOS" || ordem.status === filtroStatus;
    const correspondeSetorAtual =
      filtroSetorAtual === "TODOS" || ordem.setorAtual === filtroSetorAtual;

    return (
      correspondePesquisa &&
      correspondeCliente &&
      correspondeStatus &&
      correspondeSetorAtual
    );
  });

  const ordensOrdenadas = [...ordensFiltradas].sort((a, b) => {
    if (ordenacao === "CRESCENTE") {
      return a.numero - b.numero;
    }

    return b.numero - a.numero;
  });

  const itensPorPagina = 10;
  const totalPaginas = Math.max(1, Math.ceil(ordensOrdenadas.length / itensPorPagina));
  const paginaExibida = Math.min(paginaAtual, totalPaginas);
  const indiceInicial = (paginaExibida - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const ordensPaginadas = ordensOrdenadas.slice(indiceInicial, indiceFinal);

  async function atualizarOrdemServico(
    id: number,
    dados: {
      status?: StatusOrdemServico;
      setorAtual?: string | null;
    },
  ) {
    setErroPatch("");
    setOrdensAtualizandoIds((idsAtuais) => [...idsAtuais, id]);

    try {
      const response = await fetch(`http://localhost:3001/ordensServico/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        let fallbackMessage =
          "Nao foi possivel atualizar a ordem de servico agora.";

        if (response.status === 404) {
          fallbackMessage = "A ordem de servico nao foi encontrada.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroPatch(message);
        return;
      }

      const ordemAtualizada = (await response.json()) as OrdemServico;

      setOrdensServico((ordensAtuais) =>
        ordensAtuais.map((ordem) =>
          ordem.id === id ? ordemAtualizada : ordem,
        ),
      );
    } catch (error) {
      console.error(error);
      setErroPatch(
        "Nao foi possivel conectar com a API para atualizar a ordem de servico.",
      );
    } finally {
      setOrdensAtualizandoIds((idsAtuais) =>
        idsAtuais.filter((ordemId) => ordemId !== id),
      );
    }
  }

  function onStatusChange(ordemServico: OrdemServico, nextStatus: string) {
    const statusNormalizado = nextStatus as StatusOrdemServico;

    if (
      statusNormalizado === "EM_ANDAMENTO" &&
      !isSetorProdutivo(ordemServico.setorAtual)
    ) {
      setErroPatch(
        "Para colocar uma OS em andamento pela listagem, use a edicao completa e escolha um setor produtivo valido.",
      );
      return;
    }

    const payload: {
      status: StatusOrdemServico;
      setorAtual?: string | null;
    } = { status: statusNormalizado };

    if (statusNormalizado === "NAO_INICIADA" || statusNormalizado === "CANCELADA") {
      payload.setorAtual = null;
    }

    if (statusNormalizado === "EM_ANDAMENTO") {
      payload.setorAtual = ordemServico.setorAtual;
    }

    atualizarOrdemServico(ordemServico.id, payload);
  }

  function onSetorAtualChange(ordemServico: OrdemServico, nextSetorAtual: string) {
    if (ordemServico.status !== "EM_ANDAMENTO") {
      setErroPatch(
        "O setor atual so pode ser alterado rapidamente quando a OS estiver em andamento.",
      );
      return;
    }

    if (!isSetorProdutivo(nextSetorAtual)) {
      setErroPatch("Selecione um setor produtivo valido.");
      return;
    }

    atualizarOrdemServico(ordemServico.id, {
      setorAtual: nextSetorAtual,
    });
  }

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando ordens de servico...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Ordens de Servico</h1>

        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          onClick={() => navigate("/ordem-servico/novo")}
        >
          <Plus size={18} />
          Adicionar Ordem de Servico
        </button>
      </div>

      {erroCarregamento ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroCarregamento}
        </div>
      ) : null}

      {erroPatch ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroPatch}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Pesquisar por numero ou peca..."
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

          {statusOrdemServicoOptions.map((status) => (
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
          value={filtroSetorAtual}
          onChange={(event) => {
            setFiltroSetorAtual(event.target.value);
            setPaginaAtual(1);
          }}
          className="rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900"
        >
          <option value="TODOS">Todos os setores</option>

          {setorAtualOptions.map((setor) => (
            <option key={setor.value} value={setor.value}>
              {setor.label}
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
              <th className="border-b border-slate-600 p-3">Numero</th>
              <th className="border-b border-slate-600 p-3">Cliente</th>
              <th className="border-b border-slate-600 p-3">Pedido</th>
              <th className="border-b border-slate-600 p-3">Peca</th>
              <th className="border-b border-slate-600 p-3">Quantidade</th>
              <th className="border-b border-slate-600 p-3">Data de entrega</th>
              <th className="border-b border-slate-600 p-3">Status</th>
              <th className="border-b border-slate-600 p-3">Setor atual</th>
              <th className="border-b border-slate-600 p-3 text-center">
                Acoes
              </th>
            </tr>
          </thead>

          <tbody>
            {ordensPaginadas.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="border-b border-slate-400 p-6 text-center text-slate-700"
                >
                  Nenhuma ordem de servico encontrada para os filtros atuais.
                </td>
              </tr>
            ) : null}

            {ordensPaginadas.map((ordemServico) => {
              const pedido = pedidos.find(
                (pedidoAtual) => pedidoAtual.id === ordemServico.pedidoId,
              );
              const cliente = clientes.find(
                (clienteAtual) => clienteAtual.id === pedido?.clienteId,
              );
              const peca = pecas.find(
                (pecaAtual) => pecaAtual.id === ordemServico.pecaId,
              );
              const linhaAtualizando = ordensAtualizandoIds.includes(
                ordemServico.id,
              );
              const valorSetorAtual =
                ordemServico.status === "EM_ANDAMENTO"
                  ? isSetorProdutivo(ordemServico.setorAtual)
                    ? ordemServico.setorAtual
                    : ""
                  : ordemServico.status === "CONCLUIDA"
                    ? "LIBERADO"
                    : "";

              return (
                <tr
                  key={ordemServico.id}
                  className="transition hover:bg-slate-300"
                  onClick={() => navigate(`./view/${ordemServico.id}`)}
                >
                  <td className="border-b border-slate-400 p-3">
                    {ordemServico.numero}
                  </td>

                  <td className="border-b border-slate-400 p-3">
                    {cliente?.nome ?? "Cliente nao encontrado"}
                  </td>

                  <td className="border-b border-slate-400 p-3">
                    {pedido?.codigo ?? "Pedido nao encontrado"}
                  </td>

                  <td className="border-b border-slate-400 p-3">
                    {peca?.codigo ?? "Peca nao encontrada"}
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
                      disabled={linhaAtualizando}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      onChange={(event) =>
                        onStatusChange(ordemServico, event.target.value)
                      }
                      className="rounded-md border border-slate-400 bg-slate-100 px-2 py-1 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200"
                    >
                      {statusOrdemServicoOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="border-b border-slate-400 p-3">
                    {ordemServico.status === "EM_ANDAMENTO" ? (
                      <select
                        value={valorSetorAtual}
                        disabled={linhaAtualizando}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        onChange={(event) =>
                          onSetorAtualChange(ordemServico, event.target.value)
                        }
                        className="rounded-md border border-slate-400 bg-slate-100 px-2 py-1 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200"
                      >
                        <option value="" disabled>
                          Escolha um setor
                        </option>

                        {setorProdutivoOptions.map((setor) => (
                          <option key={setor.value} value={setor.value}>
                            {setor.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-slate-900">
                        {getSetorAtualLabel(
                          ordemServico.status === "CONCLUIDA"
                            ? "LIBERADO"
                            : ordemServico.setorAtual,
                        )}
                      </span>
                    )}
                  </td>

                  <td className="border-b border-slate-400 p-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                        title="Editar ordem de servico"
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
              );
            })}
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
            Pagina {paginaExibida} de {totalPaginas}
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

export default OrdensServico;
