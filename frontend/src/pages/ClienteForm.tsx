import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

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

function ClienteForm() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contato, setContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroSubmit, setErroSubmit] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

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
    };

    setSalvando(true);

    try {
      const response = await apiFetch("/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        let fallbackMessage = "Não foi possível cadastrar o cliente agora.";

        if (response.status === 409) {
          fallbackMessage = "Já existe um cliente com esse CNPJ.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/clientes");
    } catch (error) {
      console.error(error);
      setErroSubmit("Não foi possível conectar com a API para cadastrar o cliente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Cadastrar Cliente</h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar um novo cliente.
        </p>
      </div>

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
            placeholder="Digite o nome do cliente..."
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
            placeholder="Digite o CNPJ..."
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
              placeholder="Digite o nome do contato..."
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
              placeholder="Digite o telefone..."
              onChange={(event) => setTelefone(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
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
            title="Salvar cliente"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ClienteForm;
