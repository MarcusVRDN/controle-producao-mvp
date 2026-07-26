import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ordensServico = [
  {
    id: 1,
    numero: "3789",
    cliente: "Zuiko",
    pedido: "186215",
    peca: "125DE45",
    quantidade: "1",
    dataEntrega: "12/10/2026",
    status: "ABERTA",
  },
  {
    id: 2,
    numero: "3489",
    cliente: "KHS",
    pedido: "71AS78",
    peca: "KHS-0001",
    quantidade: "4",
    dataEntrega: "07/10/2026",
    status: "ABERTA",
  },
  {
    id: 3,
    numero: "48665",
    cliente: "FKB",
    pedido: "2784",
    peca: "FKB0010",
    quantidade: "7",
    dataEntrega: "01/10/2026",
    status: "FINALIZADA",
  },
];

function OrdensServico() {
  const navigate = useNavigate()
  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Ordens de Serviço</h1>

        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        onClick={() => navigate ("/ordem-servico/novo")}>
          <Plus size={18} />
          Adicionar Ordem de Serviço
        </button>
      </div>

      <input
        type="text"
        placeholder="Pesquisar ordem de serviço..."
        className="w-full max-w-md rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />

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

              <th className="border-b border-slate-600 p-3 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {ordensServico.map((ordemServico) => (
              <tr key={ordemServico.id} className="transition hover:bg-slate-300">
                <td className="border-b border-slate-400 p-3">{ordemServico.numero}</td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.cliente}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.pedido}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.peca}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.quantidade}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.dataEntrega}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {ordemServico.status}
                </td>

                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar ordem de serviço"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="rounded-md p-2 text-red-600 transition hover:bg-red-100"
                      title="Excluir ordem de serviço"
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

export default OrdensServico;
