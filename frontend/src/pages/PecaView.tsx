import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  normalizeTerceirizacaoValue,
  normalizeTratamentoSuperficialValue,
  normalizeTratamentoTermicoValue,
} from "./pecaOptions";
import { apiFetch } from "../services/api";

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
        setErro("ID da peça não informado.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const responsePeca = await apiFetch(`/pecas/${id}`);

        if (!responsePeca.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responsePeca,
              "Não foi possível carregar a peça.",
            ),
          );
        }

        const pecaApi = (await responsePeca.json()) as Peca;
        setPeca(pecaApi);

        const responseCliente = await apiFetch(
          `/clientes/${pecaApi.clienteId}`,
        );

        if (!responseCliente.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responseCliente,
              "Não foi possível carregar o cliente da peça.",
            ),
          );
        }

        const clienteApi = await responseCliente.json();
        setCliente(clienteApi);
      } catch (error) {
        console.error(error);
        setErro(
          error instanceof Error ? error.message : "Não foi possível carregar a peça.",
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarPeca();
  }, [id]);

  if (carregando) {
    return <p className="text-sm text-slate-200">Carregando peça...</p>;
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
          Não foi possível montar os detalhes da peça.
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
          <h1 className="text-xl font-semibold text-white">Detalhes da peça</h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas da peça.
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
            <p className="text-sm text-slate-500">Código</p>
            <p className="font-medium text-slate-900">{peca.codigo}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Cliente</p>
            <p className="font-medium text-slate-900">{cliente.nome}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Descrição</p>
            <p className="font-medium text-slate-900">{peca.descricao}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Material</p>
            <p className="font-medium text-slate-900">{peca.material}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tratamento Térmico</p>
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
            <p className="text-sm text-slate-500">Terceirização</p>
            <p className="font-medium text-slate-900">
              {normalizeTerceirizacaoValue(peca.terceirizacao) || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Observação</p>
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
