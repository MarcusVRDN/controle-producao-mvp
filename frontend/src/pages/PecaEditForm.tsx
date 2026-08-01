import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type SyntheticEvent } from "react";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  contato?: string;
  telefone?: string;
  ativo: boolean;
};

function PecaEditForm() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [material, setMaterial] = useState("");
  const [tratamentoTermico, setTratamentoTermico] = useState("");
  const [tratamentoSuperficial, setTratamentoSuperficial] = useState("");
  const [terceirizacao, setTerceirizacao] = useState("");
  const [observacao, setObservacao] = useState("");

  const { id } = useParams()

  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    async function buscarClientes() {
      const response = await fetch("http://localhost:3001/clientes");
      if (response.ok) {
        const clientesApi = await response.json();
        setClientes(clientesApi);
      } else {
        console.error("Erro ao buscar clientes");
      }
    }
    buscarClientes();
  }, []);

  useEffect (() => {
    async function buscarPeca() {
        const response = await fetch(`http://localhost:3001/pecas/${id}`);
        if (response.ok) {
            const pecaApi = await response.json();
            setCodigo(pecaApi.codigo);
            setClienteId(String(pecaApi.clienteId));
            setDescricao(pecaApi.descricao);
            setMaterial(pecaApi.material);
            setTratamentoTermico(pecaApi.tratamentoTermico);
            setTratamentoSuperficial(pecaApi.tratamentoSuperficial);
            setTerceirizacao(pecaApi.terceirizacao);
            setObservacao(pecaApi.observacao)
        }else{
            console.error("Erro ao buscar peça")
        }
    }
    buscarPeca();
  }, [id] )

  async function onHandleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const peca = {
      codigo,
      clienteId: Number(clienteId),
      descricao,
      material,
      tratamentoTermico,
      tratamentoSuperficial,
      terceirizacao,
      observacao
    };
    const response = await fetch(`http://localhost:3001/pecas/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(peca),
    });
    if (response.ok) {
      const obj = await response.json();
      console.log (obj);
      navigate("/pecas")
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Editar Peça</h1>

        <p className="text-sm text-slate-300">
          Edite os campos desejados
        </p>
      </div>

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={onHandleSubmit}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="codigo"
              className="text-sm font-medium text-slate-700"
            >
              Código
            </label>

            <input
              id="codigo"
              name="codigo"
              type="text"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value)}
              placeholder="Digite o código da peça..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="clienteId"
              className="text-sm font-medium text-slate-700"
            >
              Cliente
            </label>

            <select
              id="clienteId"
              name="clienteId"
              value={clienteId}
              onChange={(event) => setClienteId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha o cliente...
              </option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="descricao"
            className="text-sm font-medium text-slate-700"
          >
            Descrição
          </label>

          <input
            id="descricao"
            name="descricao"
            type="text"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Digite a descrição da peça..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="material"
            className="text-sm font-medium text-slate-700"
          >
            Material
          </label>

          <input
            id="material"
            name="material"
            type="text"
            value={material}
            placeholder="Digite o material da peça..."
            onChange={(event) => setMaterial(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tratamentoTermico"
              className="text-sm font-medium text-slate-700"
            >
              Tratamento Térmico
            </label>

            <select
              id="tratamentoTermico"
              name="tratamentoTermico"
              value={tratamentoTermico}
              onChange={(event) => setTratamentoTermico(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha o tratamento...
              </option>
              <option value="nenhum">Nenhum</option>
              <option value="tempera">Têmpera</option>
              <option value="cementacao">Cementação</option>
              <option value="nitretacao">Nitretação</option>
              <option value="temperaInducao">Têmpera por indução</option>
              <option value="temperaVacuo">Têmpera a vácuo</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tratamentoSuperficial"
              className="text-sm font-medium text-slate-700"
            >
              Tratamento Superficial
            </label>

            <select
              id="tratamentoSuperficial"
              name="tratamentoSuperficial"
              value={tratamentoSuperficial}
              onChange={(event) => setTratamentoSuperficial(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha o tratamento...
              </option>
              <option value="nenhum">Nenhum</option>
              <option value="niquel">Níquel Químico</option>
              <option value="oxidacao">Oxidação Negra</option>
              <option value="anodizacaoNatural">Anodização Natural</option>
              <option value="anodizacaoDura">Anodização Dura</option>
              <option value="zincagem">Zincagem</option>
              <option value="fosfatizacao">Fosfatização</option>
              <option value="jateamento">Jateamento</option>
              <option value="pintura">Pintura</option>
              <option value="plasma">Plasma</option>
              <option value="cromo">Cromo</option>
              <option value="silicone">Silicone</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="terceirizacao"
              className="text-sm font-medium text-slate-700"
            >
              Terceirização
            </label>

            <select
              id="terceirizacao"
              name="terceirizacao"
              value={terceirizacao}
              onChange={(event) => setTerceirizacao(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha a terceirização...
              </option>
              <option value="nenhuma">Nenhuma</option>
              <option value="solda">Solda</option>
              <option value="corteFio">Corte a fio</option>
              <option value="corteLaser">Corte a laser</option>
              <option value="calandra">Calandra</option>
              <option value="balanceamento">Balanceamento</option>
              <option value="furacaoProfunda">Furação Profunda</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="observacao"
            className="text-sm font-medium text-slate-700"
          >
            Observação
          </label>

          <textarea
            id="observacao"
            name="observacao"
            rows={4}
            placeholder="Digite as observações..."
            value = {observacao}
            onChange={(event) => setObservacao(event.target.value)}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            title="Cancelar"
            onClick={() => navigate("/pecas")}
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

export default PecaEditForm;
