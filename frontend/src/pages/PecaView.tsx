import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  normalizeTerceirizacaoValue,
  normalizeTratamentoSuperficialValue,
  normalizeTratamentoTermicoValue,
} from "./pecaOptions";

type Peca = {
  id: number;
  codigo: string;
  clienteId: number;
  descricao: string;
  material: string;
  tratamentoTermico: string | null;
  tratamentoSuperficial: string | null;
  terceirizacao: string | null;
  observacao: string | null;
  createdAt: string;
  updatedAt: string;
};

type Cliente = {
  id: number;
  nome: string;
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

function PecaView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [peca, setPeca] = useState<Peca | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarPeca() {
      if (!id) {
        setErro("ID da peca nao informado.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const responsePeca = await fetch(`http://localhost:3001/pecas/${id}`);

        if (!responsePeca.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responsePeca,
              "Nao foi possivel carregar a peca.",
            ),
          );
        }

        const pecaApi = (await responsePeca.json()) as Peca;
        setPeca(pecaApi);

        const responseCliente = await fetch(
          `http://localhost:3001/clientes/${pecaApi.clienteId}`,
        );

        if (!responseCliente.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responseCliente,
              "Nao foi possivel carregar o cliente da peca.",
            ),
          );
        }

        const clienteApi = await responseCliente.json();
        setCliente(clienteApi);
      } catch (error) {
        console.error(error);
        setErro(
          error instanceof Error ? error.message : "Nao foi possivel carregar a peca.",
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarPeca();
  }, [id]);

  if (carregando) {
    return <p className="text-sm text-slate-200">Carregando peca...</p>;
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
            onClick={() => navigate("/pecas")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  if (!peca || !cliente) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Nao foi possivel montar os detalhes da peca.
        </div>

        <div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => navigate("/pecas")}
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
          <h1 className="text-xl font-semibold text-white">Detalhes da peca</h1>

          <p className="text-sm text-slate-300">
            Consulte as informacoes completas da peca.
          </p>
        </div>

        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          onClick={() => navigate("/pecas")}
        >
          Voltar
        </button>
      </div>

      <div className="w-full max-w-4xl rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Codigo</p>
            <p className="font-medium text-slate-900">{peca.codigo}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Cliente</p>
            <p className="font-medium text-slate-900">{cliente.nome}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Descricao</p>
            <p className="font-medium text-slate-900">{peca.descricao}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Material</p>
            <p className="font-medium text-slate-900">{peca.material}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tratamento Termico</p>
            <p className="font-medium text-slate-900">
              {normalizeTratamentoTermicoValue(peca.tratamentoTermico) || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tratamento Superficial</p>
            <p className="font-medium text-slate-900">
              {normalizeTratamentoSuperficialValue(peca.tratamentoSuperficial) ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Terceirizacao</p>
            <p className="font-medium text-slate-900">
              {normalizeTerceirizacaoValue(peca.terceirizacao) || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Observacao</p>
            <p className="font-medium text-slate-900">
              {peca.observacao ?? "-"}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-300 pt-6">
            <div>
              <p className="text-sm text-slate-500">Criado em:</p>
              <p className="font-medium text-slate-900">
                {new Date(peca.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Ultima atualizacao</p>
              <p className="font-medium text-slate-900">
                {new Date(peca.updatedAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PecaView;
