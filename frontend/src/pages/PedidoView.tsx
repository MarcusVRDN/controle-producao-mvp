import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
  status: string;
  observacao: string;
  createdAt: string;
  updatedAt: string;
};

type Cliente = {
  id: number;
  nome: string;
};

function PedidoView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  useEffect(() => {
    async function buscarPedido() {
      const responsePedido = await fetch(`http://localhost:3001/pedidos/${id}`);

      if (!responsePedido.ok) {
        console.error("Erro ao buscar pedido");
        return;
      }

      const pedidoApi = await responsePedido.json();
      setPedido(pedidoApi);

      const responseCliente = await fetch(
        `http://localhost:3001/clientes/${pedidoApi.clienteId}`,
      );

      if (responseCliente.ok) {
        const clienteApi = await responseCliente.json();
        setCliente(clienteApi);
      } else {
        console.error("Erro ao buscar cliente");
      }
    }

    buscarPedido();
  }, [id]);

  if (!pedido || !cliente) {
    return <p>Carregando...</p>;
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
            <p className="font-medium text-slate-900">{pedido.status}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Observação</p>
            <p className="font-medium text-slate-900">
              {pedido.observacao || "-"}
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
                <p className="text-sm text-slate-500">Última atualização</p>
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
