import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  pedidoStatusOptions,
  type PedidoStatus,
} from "./pedidoOptions";

type Cliente = {
  id: number;
  nome: string;
};

type PedidoApi = {
  codigo: string;
  clienteId: number;
  observacao: string | null;
  status: PedidoStatus;
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

function PedidoEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [codigo, setCodigo] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState<PedidoStatus>("ABERTO");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroSubmit, setErroSubmit] = useState("");

  useEffect(() => {
    async function carregarDados() {
      if (!id) {
        setErroCarregamento("ID do pedido nao informado.");
        setCarregandoDados(false);
        return;
      }

      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const [responseClientes, responsePedido] = await Promise.all([
          fetch("http://localhost:3001/clientes"),
          fetch(`http://localhost:3001/pedidos/${id}`),
        ]);

        if (!responsePedido.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responsePedido,
              "Nao foi possivel carregar o pedido.",
            ),
          );
        }

        if (!responseClientes.ok) {
          throw new Error("Nao foi possivel carregar os clientes do pedido.");
        }

        const [clientesApi, pedidoApi] = await Promise.all([
          responseClientes.json(),
          responsePedido.json(),
        ]);

        const dadosPedido = pedidoApi as PedidoApi;

        setClientes(clientesApi);
        setCodigo(dadosPedido.codigo);
        setClienteId(String(dadosPedido.clienteId));
        setObservacao(dadosPedido.observacao ?? "");
        setStatus(dadosPedido.status);
      } catch (error) {
        console.error(error);
        setErroCarregamento(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar o pedido.",
        );
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, [id]);

  async function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

    if (!id) {
      setErroSubmit("ID do pedido nao informado.");
      return;
    }

    const codigoNormalizado = codigo.trim();
    const observacaoNormalizada = observacao.trim();
    const clienteIdNormalizado = Number(clienteId);

    if (codigoNormalizado === "") {
      setErroSubmit("Informe o codigo do pedido.");
      return;
    }

    if (!Number.isInteger(clienteIdNormalizado) || clienteIdNormalizado <= 0) {
      setErroSubmit("Selecione um cliente valido.");
      return;
    }

    const pedido = {
      codigo: codigoNormalizado,
      clienteId: clienteIdNormalizado,
      observacao: observacaoNormalizada === "" ? null : observacaoNormalizada,
      status,
    };

    setSalvando(true);

    try {
      const response = await fetch(`http://localhost:3001/pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        let fallbackMessage = "Nao foi possivel atualizar o pedido agora.";

        if (response.status === 404) {
          fallbackMessage = "Pedido ou cliente nao encontrados.";
        }

        if (response.status === 409) {
          fallbackMessage = "Ja existe um pedido com esse codigo.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/pedidos");
    } catch (error) {
      console.error(error);
      setErroSubmit("Nao foi possivel conectar com a API para atualizar o pedido.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando pedido...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Editar Pedido</h1>

        <p className="text-sm text-slate-300">Edite os campos desejados.</p>
      </div>

      {erroCarregamento ? (
        <div className="w-full max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroCarregamento}
        </div>
      ) : null}

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={onHandleSubmit}
      >
        {erroSubmit ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroSubmit}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="codigo"
            className="text-sm font-medium text-slate-700"
          >
            Codigo
          </label>

          <input
            id="codigo"
            name="codigo"
            type="text"
            value={codigo}
            required
            onChange={(event) => setCodigo(event.target.value)}
            placeholder="Digite o codigo do pedido"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="clienteId"
            className="text-sm font-medium text-slate-700"
          >
            Cliente
          </label>

          <select
            id="clienteId"
            name="clienteId"
            value={clienteId}
            onChange={(event) => setClienteId(event.target.value)}
            required
            disabled={salvando}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
          >
            <option value="" disabled>
              Escolha o cliente...
            </option>

            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="observacao"
            className="text-sm font-medium text-slate-700"
          >
            Observacao
          </label>

          <textarea
            id="observacao"
            name="observacao"
            rows={4}
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            placeholder="Digite as observacoes..."
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as PedidoStatus)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          >
            {pedidoStatusOptions.map((opcaoStatus) => (
              <option key={opcaoStatus.value} value={opcaoStatus.value}>
                {opcaoStatus.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            title="Cancelar"
            disabled={salvando}
            onClick={() => navigate("/pedidos")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            title="Salvar alteracoes"
            disabled={salvando || !!erroCarregamento}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PedidoEditForm;
