import { Pencil, Plus, Trash2 } from "lucide-react";

const pecas = [
  {
    id: 1,
    codigo: "13857",
    cliente: "Zuiko",
    descricao: "Polia",
    material: "Aço 1020",
    tratamentoTermico: "Tempera",
    tratamentoSuperficial: "N/A",
    terceirizacao: "N/A",
  },
  {
    id: 2,
    codigo: "432951",
    cliente: "Avibras",
    descricao: "Caixa",
    material: "Aço H13",
    tratamentoTermico: "Tempera",
    tratamentoSuperficial: "Oxidação",
    terceirizacao: "Solda",
  },
  {
    id: 3,
    codigo: "482957",
    cliente: "FKB",
    descricao: "Eixo",
    material: "Aço 4340",
    tratamentoTermico: "Tempera",
    tratamentoSuperficial: "N/A",
    terceirizacao: "N/A",
  },
];

function Pecas() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Peças</h1>

        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
          <Plus size={18} />
          Adicionar Peça
        </button>
      </div>

      <input
        type="text"
        placeholder="Pesquisar peça..."
        className="w-full max-w-md rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-hidden rounded-lg border border-slate-600">
        <table className="w-full border-collapse bg-slate-200 text-left text-sm">
          <thead className="bg-slate-300">
            <tr>
              <th className="border-b border-slate-600 p-3">Código</th>
              <th className="border-b border-slate-600 p-3">Cliente</th>
              <th className="border-b border-slate-600 p-3">Descrição</th>
              <th className="border-b border-slate-600 p-3">Material</th>
              <th className="border-b border-slate-600 p-3 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {pecas.map((peca) => (
              <tr key={peca.id} className="transition hover:bg-slate-300">
                <td className="border-b border-slate-400 p-3">{peca.codigo}</td>

                <td className="border-b border-slate-400 p-3">
                  {peca.cliente}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {peca.descricao}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {peca.material}
                </td>

                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar peça"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="rounded-md p-2 text-red-600 transition hover:bg-red-100"
                      title="Excluir peça"
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

export default Pecas;
