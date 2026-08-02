import { Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type Cliente = {
  id: number;
  nome: string;
};

type Peca = {
  id: number;
  codigo: string;
  clienteId: number;
  descricao: string;
  material: string;
  tratamentoTermico: string;
  tratamentoSuperficial: string;
  terceirizacao: string;
  observacao: string;
};

function Pecas() {
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

  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Peças</h1>

        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          onClick={() => navigate("/pecas/novo")}
        >
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
                  {clientes.find((cliente) => cliente.id === peca.clienteId)
                    ?.nome ?? "Cliente não encontrado"}
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
                      onClick={() => navigate(`/pecas/editar/${peca.id}`)}
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

export default Pecas;
