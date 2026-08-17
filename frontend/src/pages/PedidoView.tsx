import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPedidoStatusLabel } from "./pedidoOptions";
import { apiFetch } from "../services/api";

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
  status: string;
  observacao: string | null;
  createdAt: string;
  updatedAt: string;
};

type Cliente = {
  id: number;
  nome: string;
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

function PedidoView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarPedido() {
      if (!id) {
        setErro("ID do pedido não informado.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const responsePedido = await apiFetch(`/pedidos/${id}`);

        if (!responsePedido.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responsePedido,
              "Não foi possível carregar o pedido.",
            ),
          );
        }

        const pedidoApi = (await responsePedido.json()) as Pedido;
        setPedido(pedidoApi);

        const responseCliente = await apiFetch(
          `/clientes/${pedidoApi.clienteId}`,
        );

        if (!responseCliente.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responseCliente,
              "Não foi possível carregar o cliente do pedido.",
            ),
          );
        }

        const clienteApi = await responseCliente.json();
        setCliente(clienteApi);
      } catch (error) {
        console.error(error);
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o pedido.",
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarPedido();
  }, [id]);

  if (carregando) {
    return <p className="text-sm text-slate-200">Carregando pedido...</p>;
  }

  if (erro) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>

        <div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => navigate("/pedidos")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  if (!pedido || !cliente) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Não foi possível montar os detalhes do pedido.
        </div>

        <div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => navigate("/pedidos")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Detalhes do pedido
          </h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas do pedido.
          </p>
        </div>

        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          onClick={() => navigate("/pedidos")}
        >
          Voltar
        </button>
      </div>

      <div className="w-full max-w-4xl rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Código</p>
            <p className="font-medium text-slate-900">{pedido.codigo}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Cliente</p>
            <p className="font-medium text-slate-900">{cliente.nome}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="font-medium text-slate-900">
              {getPedidoStatusLabel(pedido.status)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Observação</p>
            <p className="font-medium text-slate-900">
              {pedido.observacao ?? "-"}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-300 pt-6 md:col-span-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Criado em</p>
                <p className="font-medium text-slate-900">
                  {new Date(pedido.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Ultima atualizacao</p>
                <p className="font-medium text-slate-900">
                  {new Date(pedido.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PedidoView;
