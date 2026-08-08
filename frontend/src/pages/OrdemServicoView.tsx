import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

function OrdemServicoView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ordemServico, setOrdemServico] = useState<OrdemServico | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [peca, setPeca] = useState<Peca | null>(null);

  useEffect(() => {
    async function buscarOrdemServico() {
      const responseOrdemServico = await fetch(
        `http://localhost:3001/ordensServico/${id}`,
      );

      if (!responseOrdemServico.ok) {
        console.error("Erro ao buscar ordem de serviço");
        return;
      }

      const ordemServicoApi = await responseOrdemServico.json();
      setOrdemServico(ordemServicoApi);

      const responsePedido = await fetch(
        `http://localhost:3001/pedidos/${ordemServicoApi.pedidoId}`,
      );

      const responsePeca = await fetch(
        `http://localhost:3001/pecas/${ordemServicoApi.pecaId}`,
      );

      if (!responsePedido.ok || !responsePeca.ok) {
        console.error("Erro ao buscar pedido ou peça");
        return;
      }

      const pedidoApi = await responsePedido.json();
      const pecaApi = await responsePeca.json();

      setPedido(pedidoApi);
      setPeca(pecaApi);

      const responseCliente = await fetch(
        `http://localhost:3001/clientes/${pedidoApi.clienteId}`,
      );

      if (!responseCliente.ok) {
        console.error("Erro ao buscar cliente");
        return;
      }

      const clienteApi = await responseCliente.json();
      setCliente(clienteApi);
    }

    buscarOrdemServico();
  }, [id]);
  if (!ordemServico || !cliente || !peca || !pedido) {
    return <p>Carregando...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Detalhes da ordem de serviço
          </h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas da ordem de serviço
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
            <p className="text-sm text-slate-500">Número</p>
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
            <p className="text-sm text-slate-500">Horas unitárias</p>
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
            <p className="font-medium text-slate-900">{ordemServico.status}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Setor Atual</p>
            <p className="font-medium text-slate-900">
              {ordemServico.setorAtual ?? "Sem setor atual"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm text-slate-500">Possui RNC?</p>
              <p className="font-medium text-slate-900">
                {ordemServico.possuiRnc === true ? "Sim" : "Não"}
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
            <p className="text-sm text-slate-500">Possui Devolução?</p>
            <p className="font-medium text-slate-900">
              {ordemServico.possuiDevolucao === true ? "Sim" : "Não"}
            </p>
            <div>
              <p className="text-sm text-slate-500">Data:</p>
              <p className="font-medium text-slate-900">
                {ordemServico.possuiDevolucao && ordemServico.dataDevolucao
                  ? new Date(ordemServico.dataDevolucao).toLocaleDateString("pt-BR")
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
              <p className="text-sm text-slate-500">Última atualização</p>
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
