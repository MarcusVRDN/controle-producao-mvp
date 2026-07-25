import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


const clientes = [
  {
    id: 1,
    nome: "Avibras",
    cnpj: "54.825.471/887",
    contato: "Mauricio",
    telefone: "(12) 98832-0156",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "GD DO BRASIL",
    cnpj: "22.812.756/3215",
    contato: "Lucas",
    telefone: "(12) 97458-9863",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "KHS",
    cnpj: "14.806.978/58",
    contato: "Sergio",
    telefone: "(12) 94578-3659",
    status: "Ativo",
  },
];

function Clientes() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Clientes</h1>

        <button 
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        onClick={() => navigate("/clientes/novo")}
        >  
          <Plus size={18} />
          Adicionar Cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Pesquisar cliente..."
        className="w-full max-w-md rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-hidden rounded-lg border border-slate-600">
        <table className="w-full border-collapse bg-slate-200 text-left text-sm">
          <thead className="bg-slate-300">
            <tr>
              <th className="border-b border-slate-600 p-3">Nome</th>
              <th className="border-b border-slate-600 p-3">CNPJ</th>
              <th className="border-b border-slate-600 p-3">Contato</th>
              <th className="border-b border-slate-600 p-3">Telefone</th>
              <th className="border-b border-slate-600 p-3">Status</th>
              <th className="border-b border-slate-600 p-3 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente.id}
                className="transition hover:bg-slate-300"
              >
                <td className="border-b border-slate-400 p-3">
                  {cliente.nome}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {cliente.cnpj}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {cliente.contato}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {cliente.telefone}
                </td>

                <td className="border-b border-slate-400 p-3">
                  {cliente.status}
                </td>

                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar cliente"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-slate-700"
                      title="Excluir cliente"
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

export default Clientes;