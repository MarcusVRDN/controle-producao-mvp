import { useNavigate } from "react-router-dom";

function PedidoForm() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Cadastrar Pedido</h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar um novo pedido.
        </p>
      </div>

      <form className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md">
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
            placeholder="Digite o código do pedido"
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
            onClick={() => navigate("/pedidos")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            title="Salvar pedido"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}

export default PedidoForm;
