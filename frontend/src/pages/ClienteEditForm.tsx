import { useNavigate, useParams } from "react-router-dom";
import { useState, type SyntheticEvent, useEffect } from "react";

function ClienteEditForm() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contato, setContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [ativo, setAtivo] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function buscarCliente() {
      const response = await fetch(`http://localhost:3001/clientes/${id}`);
      if (response.ok) {
        const clienteApi = await response.json();
        setNome(clienteApi.nome);
        setCnpj(clienteApi.cnpj);
        setContato(clienteApi.contato ?? "");
        setTelefone(clienteApi.telefone ?? "");
        setAtivo(clienteApi.ativo);
      } else {
        console.error("Erro ao buscar cliente");
      }
    }
    buscarCliente();
  }, [id]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const cliente = {
      nome,
      cnpj,
      contato,
      telefone,
      ativo,
    };

    const response = await fetch(`http://localhost:3001/clientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    if (response.ok) {
      navigate("/clientes");
    } else {
      console.error("Erro ao atualizar cliente");
    }
  }
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Editar Cliente</h1>

        <p className="text-sm text-slate-300">Edite os campos desejados</p>
      </div>

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="nome" className="text-sm font-medium text-slate-700">
            Nome
          </label>

          <input
            id="nome"
            name="nome"
            type="text"
            value={nome}
            required
            onChange={(event) => setNome(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cnpj" className="text-sm font-medium text-slate-700">
            CNPJ
          </label>

          <input
            id="cnpj"
            name="cnpj"
            type="text"
            value={cnpj}
            required
            onChange={(event) => setCnpj(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contato"
              className="text-sm font-medium text-slate-700"
            >
              Contato
            </label>

            <input
              id="contato"
              name="contato"
              type="text"
              value={contato}
              onChange={(event) => setContato(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="telefone"
              className="text-sm font-medium text-slate-700"
            >
              Telefone
            </label>

            <input
              id="telefone"
              name="telefone"
              type="text"
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="ativo"
              name="ativo"
              type="checkbox"
              checked={ativo}
              onChange={(event) => setAtivo(event.target.checked)}
              className="h-4 w-4"
            />

            <label
              htmlFor="ativo"
              className="text-sm font-medium text-slate-700"
            >
              Ativo
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            title="Cancelar"
            onClick={() => navigate("/clientes")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            title="Salvar alterações"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}

export default ClienteEditForm;
