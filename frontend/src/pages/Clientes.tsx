import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  contato: string | null;
  telefone: string | null;
  ativo: boolean;
};

function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [ordenacao, setOrdenacao] = useState("AZ");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    async function buscarClientes() {
      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const response = await fetch("http://localhost:3001/clientes");

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar os clientes.");
        }

        const clientesApi = await response.json();
        setClientes(clientesApi);
      } catch (error) {
        console.error(error);
        setErroCarregamento("Nao foi possivel carregar a lista de clientes.");
      } finally {
        setCarregandoDados(false);
      }
    }

    buscarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = pesquisa.trim().toLowerCase();
    const correspondePesquisa =
      termo === "" || cliente.nome.toLowerCase().includes(termo);

    const correspondeStatus =
      filtroStatus === "TODOS" ||
      (filtroStatus === "ATIVOS" && cliente.ativo) ||
      (filtroStatus === "INATIVOS" && !cliente.ativo);

    return correspondePesquisa && correspondeStatus;
  });

  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
    if (ordenacao === "AZ") {
      return a.nome.localeCompare(b.nome);
    }

    return b.nome.localeCompare(a.nome);
  });

  const itensPorPagina = 10;
  const totalPaginas = Math.max(1, Math.ceil(clientesOrdenados.length / itensPorPagina));
  const paginaExibida = Math.min(paginaAtual, totalPaginas);
  const indiceInicial = (paginaExibida - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const clientesPaginados = clientesOrdenados.slice(indiceInicial, indiceFinal);

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando clientes...</p>;
  }

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

      {erroCarregamento ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroCarregamento}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
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
          <option value="TODOS">Todos</option>
          <option value="ATIVOS">Ativos</option>
          <option value="INATIVOS">Inativos</option>
        </select>

        <select
          value={ordenacao}
          onChange={(event) => {
            setOrdenacao(event.target.value);
            setPaginaAtual(1);
          }}
          className="rounded-lg border border-slate-300 bg-slate-200 px-4 py-2 text-slate-900"
        >
          <option value="AZ">Nome A-Z</option>
          <option value="ZA">Nome Z-A</option>
        </select>
      </div>

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
                Acoes
              </th>
            </tr>
          </thead>

          <tbody>
            {clientesPaginados.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border-b border-slate-400 p-6 text-center text-slate-700"
                >
                  Nenhum cliente encontrado para os filtros atuais.
                </td>
              </tr>
            ) : null}

            {clientesPaginados.map((cliente) => (
              <tr
                key={cliente.id}
                className="transition hover:bg-slate-300"
                onClick={() => navigate(`./view/${cliente.id}`)}
              >
                <td className="border-b border-slate-400 p-3">{cliente.nome}</td>
                <td className="border-b border-slate-400 p-3">{cliente.cnpj}</td>
                <td className="border-b border-slate-400 p-3">
                  {cliente.contato ?? "-"}
                </td>
                <td className="border-b border-slate-400 p-3">
                  {cliente.telefone ?? "-"}
                </td>
                <td className="border-b border-slate-400 p-3">
                  {cliente.ativo ? "Ativo" : "Inativo"}
                </td>
                <td className="border-b border-slate-400 p-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="rounded-md p-2 text-blue-600 transition hover:bg-blue-100"
                      title="Editar cliente"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/clientes/editar/${cliente.id}`);
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

export default Clientes;
