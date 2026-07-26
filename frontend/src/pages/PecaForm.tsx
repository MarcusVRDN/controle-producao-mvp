import { useNavigate } from "react-router-dom";

function PecaForm() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Cadastrar Peça</h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar uma nova peça.
        </p>
      </div>

      <form className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md">
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
              defaultValue={""}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha o cliente...
              </option>
              <option value="1">Avibras</option>
              <option value="2">KHS</option>
              <option value="3">GD do Brasil</option>
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
            placeholder="Digite o material da peça..."
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
              defaultValue={""}
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
              defaultValue={""}
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
              defaultValue={""}
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
