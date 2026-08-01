import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Cliente = {
  id: number;
  nome: string;
};

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
  observacao: string;
  status: string;
};

function Pedidos() {
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
  },([]));

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
  },([]));
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

      <input
        type="text"
        placeholder="Pesquisar pedido..."
        className="w-full max-w-md rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />

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
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="transition hover:bg-slate-300">
                <td className="border-b border-slate-400 p-3">
                  {pedido.codigo}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {clientes.find((cliente) => cliente.id === pedido.clienteId)
                    ?.nome ?? "Cliente não encontrado"}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {pedido.observacao}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {pedido.status}
                </td>

                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar pedido"
                      onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="rounded-md p-2 text-red-600 transition hover:bg-red-100"
                      title="Excluir pedido"
                    >
                      <Trash2 size={17} />
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

export default Pedidos;
