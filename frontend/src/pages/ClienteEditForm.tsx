import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ClienteApi = {
  nome: string;
  cnpj: string;
  contato: string | null;
  telefone: string | null;
  ativo: boolean;
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

function ClienteEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contato, setContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroSubmit, setErroSubmit] = useState("");

  useEffect(() => {
    async function buscarCliente() {
      if (!id) {
        setErroCarregamento("ID do cliente nao informado.");
        setCarregandoDados(false);
        return;
      }

      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const response = await fetch(`http://localhost:3001/clientes/${id}`);

        if (!response.ok) {
          throw new Error(
            await getResponseErrorMessage(
              response,
              "Nao foi possivel carregar o cliente.",
            ),
          );
        }

        const clienteApi = (await response.json()) as ClienteApi;
        setNome(clienteApi.nome);
        setCnpj(clienteApi.cnpj);
        setContato(clienteApi.contato ?? "");
        setTelefone(clienteApi.telefone ?? "");
        setAtivo(clienteApi.ativo);
      } catch (error) {
        console.error(error);
        setErroCarregamento(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar o cliente.",
        );
      } finally {
        setCarregandoDados(false);
      }
    }

    buscarCliente();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

    if (!id) {
      setErroSubmit("ID do cliente nao informado.");
      return;
    }

    const nomeNormalizado = nome.trim();
    const cnpjNormalizado = cnpj.trim();
    const contatoNormalizado = contato.trim();
    const telefoneNormalizado = telefone.trim();

    if (nomeNormalizado === "") {
      setErroSubmit("Informe o nome do cliente.");
      return;
    }

    if (cnpjNormalizado === "") {
      setErroSubmit("Informe o CNPJ do cliente.");
      return;
    }

    const cliente = {
      nome: nomeNormalizado,
      cnpj: cnpjNormalizado,
      contato: contatoNormalizado === "" ? null : contatoNormalizado,
      telefone: telefoneNormalizado === "" ? null : telefoneNormalizado,
      ativo,
    };

    setSalvando(true);

    try {
      const response = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        let fallbackMessage = "Nao foi possivel atualizar o cliente agora.";

        if (response.status === 404) {
          fallbackMessage = "Cliente nao encontrado.";
        }

        if (response.status === 409) {
          fallbackMessage = "Ja existe um cliente com esse CNPJ.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/clientes");
    } catch (error) {
      console.error(error);
      setErroSubmit("Nao foi possivel conectar com a API para atualizar o cliente.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando cliente...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Editar Cliente</h1>

        <p className="text-sm text-slate-300">Edite os campos desejados.</p>
      </div>

      {erroCarregamento ? (
        <div className="w-full max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroCarregamento}
        </div>
      ) : null}

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={handleSubmit}
      >
        {erroSubmit ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroSubmit}
          </div>
        ) : null}

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
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            title="Cancelar"
            disabled={salvando}
            onClick={() => navigate("/clientes")}
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

export default ClienteEditForm;
