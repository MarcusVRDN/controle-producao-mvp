import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSetorAtualLabel,
  getStatusLabel,
} from "./ordemServicoOptions";
import { apiFetch } from "../services/api";

type Peca = {
  id: number;
  codigo: string;
};

type Cliente = {
  id: number;
  nome: string;
};

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
};

type OrdemServico = {
  id: number;
  numero: number;
  pedidoId: number;
  pecaId: number;
  quantidade: number;
  horasUnitarias: number;
  horasTotais: number;
  dataEntregaSolicitada: string;
  dataEntregaReal: string | null;
  setores: string;
  status: string;
  observacao: string | null;
  setorAtual: string | null;
  possuiRnc: boolean;
  possuiDevolucao: boolean;
  dataRnc: string | null;
  dataDevolucao: string | null;
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

function OrdemServicoView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ordemServico, setOrdemServico] = useState<OrdemServico | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [peca, setPeca] = useState<Peca | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarOrdemServico() {
      if (!id) {
        setErro("ID da ordem de serviço não informado.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const responseOrdemServico = await apiFetch(
          `/ordensServico/${id}`,
        );

        if (!responseOrdemServico.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responseOrdemServico,
              "Não foi possível carregar a ordem de serviço.",
            ),
          );
        }

        const ordemServicoApi = (await responseOrdemServico.json()) as OrdemServico;
        setOrdemServico(ordemServicoApi);

        const [responsePedido, responsePeca] = await Promise.all([
          apiFetch(`/pedidos/${ordemServicoApi.pedidoId}`),
          apiFetch(`/pecas/${ordemServicoApi.pecaId}`),
        ]);

        if (!responsePedido.ok || !responsePeca.ok) {
          throw new Error(
            "Não foi possível carregar o pedido e a peça da ordem de serviço.",
          );
        }

        const [pedidoApi, pecaApi] = await Promise.all([
          responsePedido.json(),
          responsePeca.json(),
        ]);

        setPedido(pedidoApi);
        setPeca(pecaApi);

        const responseCliente = await apiFetch(
          `/clientes/${pedidoApi.clienteId}`,
        );

        if (!responseCliente.ok) {
          throw new Error("Não foi possível carregar o cliente da ordem de serviço.");
        }

        const clienteApi = await responseCliente.json();
        setCliente(clienteApi);
      } catch (error) {
        console.error(error);
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os detalhes da ordem de serviço.",
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarOrdemServico();
  }, [id]);

  if (carregando) {
    return <p className="text-sm text-slate-200">Carregando ordem de serviço...</p>;
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
            onClick={() => navigate("/ordens-servico")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  if (!ordemServico || !cliente || !peca || !pedido) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Não foi possível montar todos os detalhes da ordem de serviço.
        </div>

        <div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => navigate("/ordens-servico")}
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
            Detalhes da ordem de serviço
          </h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas da ordem de serviço.
          </p>
        </div>

        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          onClick={() => navigate("/ordens-servico")}
        >
          Voltar
        </button>
      </div>

      <div className="w-full max-w-4xl rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Numero</p>
            <p className="font-medium text-slate-900">{ordemServico.numero}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Cliente</p>
            <p className="font-medium text-slate-900">{cliente.nome}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Pedido</p>
            <p className="font-medium text-slate-900">{pedido.codigo}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Peça</p>
            <p className="font-medium text-slate-900">{peca.codigo}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Quantidade</p>
            <p className="font-medium text-slate-900">
              {ordemServico.quantidade}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Horas unitarias</p>
            <p className="font-medium text-slate-900">
              {ordemServico.horasUnitarias}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Horas totais</p>
            <p className="font-medium text-slate-900">
              {ordemServico.horasTotais}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Data de entrega solicitada</p>
            <p className="font-medium text-slate-900">
              {new Date(ordemServico.dataEntregaSolicitada).toLocaleDateString(
                "pt-BR",
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Data de entrega real</p>
            <p className="font-medium text-slate-900">
              {ordemServico.dataEntregaReal
                ? new Date(ordemServico.dataEntregaReal).toLocaleDateString(
                    "pt-BR",
                  )
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Setores</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {ordemServico.setores
                ? ordemServico.setores.split(", ").map((setor) => (
                    <span
                      key={setor}
                      className="rounded-md bg-slate-200 px-3 py-1 text-sm text-slate-800"
                    >
                      {setor}
                    </span>
                  ))
                : "-"}
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="font-medium text-slate-900">
              {getStatusLabel(ordemServico.status)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Setor atual</p>
            <p className="font-medium text-slate-900">
              {getSetorAtualLabel(ordemServico.setorAtual)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm text-slate-500">Possui RNC?</p>
              <p className="font-medium text-slate-900">
                {ordemServico.possuiRnc ? "Sim" : "Não"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Data:</p>
              <p className="font-medium text-slate-900">
                {ordemServico.possuiRnc && ordemServico.dataRnc
                  ? new Date(ordemServico.dataRnc).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-500">Possui devolução?</p>
            <p className="font-medium text-slate-900">
              {ordemServico.possuiDevolucao ? "Sim" : "Não"}
            </p>
            <div>
              <p className="text-sm text-slate-500">Data:</p>
              <p className="font-medium text-slate-900">
                {ordemServico.possuiDevolucao && ordemServico.dataDevolucao
                  ? new Date(ordemServico.dataDevolucao).toLocaleDateString(
                      "pt-BR",
                    )
                  : "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-300 pt-6">
            <div>
              <p className="text-sm text-slate-500">Criado em:</p>
              <p className="font-medium text-slate-900">
                {new Date(ordemServico.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Ultima atualizacao</p>
              <p className="font-medium text-slate-900">
                {new Date(ordemServico.updatedAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrdemServicoView;
