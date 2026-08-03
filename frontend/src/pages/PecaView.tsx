import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Peca = {
  id: number;
  codigo: string;
  clienteId: number;
  descricao: string;
  material: string;
  tratamentoTermico?: string;
  tratamentoSuperficial?: string;
  terceirizacao?: string;
  observacao?: string;
  createdAt: string;
  updatedAt: string;
};

type Cliente = {
  id: number;
  nome: string;
};

function PecaView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [peca, setPeca] = useState<Peca | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  useEffect(() => {
    async function buscarPeca() {
      const responsePeca = await fetch(`http://localhost:3001/pecas/${id}`);

      if (!responsePeca.ok) {
        console.error("Erro ao buscar peça");
        return;
      }

      const pecaApi = await responsePeca.json();
      setPeca(pecaApi);

      const responseCliente = await fetch(
        `http://localhost:3001/clientes/${pecaApi.clienteId}`,
      );

      if (responseCliente.ok) {
        const clienteApi = await responseCliente.json();
        setCliente(clienteApi);
      } else {
        console.error("Erro ao buscar cliente");
      }
    }

    buscarPeca();
  }, [id]);

  if (!peca || !cliente) {
    return <p>Carregando...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Detalhes da peça</h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas da peça
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
              {peca.tratamentoTermico ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tratamento Superficial</p>
            <p className="font-medium text-slate-900">
              {peca.tratamentoSuperficial ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Terceirização</p>
            <p className="font-medium text-slate-900">
              {peca.terceirizacao ?? "-"}
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
              <p className="text-sm text-slate-500">Última atualização</p>
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
