import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  contato: string | null;
  telefone: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
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

function ClienteView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarCliente() {
      if (!id) {
        setErro("ID do cliente não informado.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const response = await apiFetch(`/clientes/${id}`);

        if (!response.ok) {
          throw new Error(
            await getResponseErrorMessage(
              response,
              "Não foi possível carregar o cliente.",
            ),
          );
        }

        const clienteApi = await response.json();
        setCliente(clienteApi);
      } catch (error) {
        console.error(error);
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o cliente.",
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarCliente();
  }, [id]);

  if (carregando) {
    return <p className="text-sm text-slate-200">Carregando cliente...</p>;
  }

  if (erro) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>

        <div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => navigate("/clientes")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  if (!cliente) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Não foi possível montar os detalhes do cliente.
        </div>

        <div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => navigate("/clientes")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Detalhes do cliente
          </h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas do cliente.
          </p>
        </div>

        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          onClick={() => navigate("/clientes")}
        >
          Voltar
        </button>
      </div>

      <div className="w-full max-w-4xl rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Nome</p>
            <p className="font-medium text-slate-900">{cliente.nome}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">CNPJ</p>
            <p className="font-medium text-slate-900">{cliente.cnpj}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Contato</p>
            <p className="font-medium text-slate-900">
              {cliente.contato ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Telefone</p>
            <p className="font-medium text-slate-900">
              {cliente.telefone ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Ativo</p>
            <p className="font-medium text-slate-900">
              {cliente.ativo ? "Ativo" : "Inativo"}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-300 pt-6">
            <div>
              <p className="text-sm text-slate-500">Criado em:</p>
              <p className="font-medium text-slate-900">
                {new Date(cliente.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Ultima atualizacao</p>
              <p className="font-medium text-slate-900">
                {new Date(cliente.updatedAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClienteView;
