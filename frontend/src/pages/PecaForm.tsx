import { useNavigate } from "react-router-dom";
import { useEffect, useState, type SyntheticEvent } from "react";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  contato?: string;
  telefone?: string;
  ativo: boolean;
};

function PecaForm() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [material, setMaterial] = useState("");
  const [tratamentoTermico, setTratamentoTermico] = useState("");
  const [tratamentoSuperficial, setTratamentoSuperficial] = useState("");
  const [terceirizacao, setTerceirizacao] = useState("");
  const [observacao, setObservacao] = useState("");

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
    const response = await fetch("http://localhost:3001/pecas", {
    method: "POST",
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
        <h1 className="text-xl font-semibold text-white">Cadastrar Peça</h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar uma nova peça.
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
              <option value="Nenhum">Nenhum</option>
              <option value="Tempera">Têmpera</option>
              <option value="Cementacao">Cementação</option>
              <option value="Nitretacao">Nitretação</option>
              <option value="Tempera por Indução">Têmpera por indução</option>
              <option value="Tempera à Vácuo">Têmpera a vácuo</option>
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
              <option value="Nenhum">Nenhum</option>
              <option value="Niquel">Níquel Químico</option>
              <option value="Oxidação">Oxidação Negra</option>
              <option value="Anodização Natural">Anodização Natural</option>
              <option value="Anodização Dura">Anodização Dura</option>
              <option value="Zincagem">Zincagem</option>
              <option value="Fosfatização">Fosfatização</option>
              <option value="Jateamento">Jateamento</option>
              <option value="Pintura">Pintura</option>
              <option value="Plasma">Plasma</option>
              <option value="Cromo">Cromo</option>
              <option value="Silicone">Silicone</option>
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
              <option value="Nenhuma">Nenhuma</option>
              <option value="Solda">Solda</option>
              <option value="Corte a Fio">Corte a fio</option>
              <option value="Corte a Laser">Corte a laser</option>
              <option value="Calandra">Calandra</option>
              <option value="Balanceamento">Balanceamento</option>
              <option value="Furação Profunda">Furação Profunda</option>
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
            title="Salvar peça"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}

export default PecaForm;
