import { useState, useEffect, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  contato?: string;
  telefone?: string;
  ativo: boolean;
};

function PedidoForm() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [observacao, setObservacao] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    async function buscarClientes() {
      const response = await fetch("http://localhost:3001/clientes");
      if (response.ok) {
        const clientesApi = await response.json();
        setClientes(clientesApi);
      } else {
        console.error("erro ao buscar clientes");
      }
    }
    buscarClientes();
  }, []);

  async function onHandleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const pedido = {
      codigo,
      clienteId: Number(clienteId),
      observacao,
    };
    const response = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });
    if (response.ok) {
      const obj = await response.json();
      console.log(obj);
      navigate("/pedidos");
    } else {
      console.error("Erro ao cadastrar pedido");
    }
  }
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Cadastrar Pedido</h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar um novo pedido.
        </p>
      </div>

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={onHandleSubmit}
      >
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
            required
            onChange={(event) => setCodigo(event.target.value)}
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
            value={clienteId}
            onChange={(event) => setClienteId(event.target.value)}
            required
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
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
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
