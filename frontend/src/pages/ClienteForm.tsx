import { useNavigate } from "react-router-dom";

function ClienteForm() {

const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">
          Cadastrar Cliente
        </h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar um novo cliente.
        </p>
      </div>

      <form className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="nome"
            className="text-sm font-medium text-slate-700"
          >
            Nome
          </label>

          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Digite o nome do cliente..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="cnpj"
            className="text-sm font-medium text-slate-700"
          >
            CNPJ
          </label>

          <input
            id="cnpj"
            name="cnpj"
            type="text"
            placeholder="Digite o CNPJ..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contato"
              className="text-sm font-medium text-slate-700"
            >
              Contato
            </label>

            <input
              id="contato"
              name="contato"
              type="text"
              placeholder="Digite o nome do contato..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="telefone"
              className="text-sm font-medium text-slate-700"
            >
              Telefone
            </label>

            <input
              id="telefone"
              name="telefone"
              type="text"
              placeholder="Digite o telefone..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            title="Cancelar"
            onClick={() => navigate ("/clientes") }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            title="Salvar cliente"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}

export default ClienteForm;