import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  terceirizacaoOptions,
  tratamentoSuperficialOptions,
  tratamentoTermicoOptions,
} from "./pecaOptions";
import { apiFetch } from "../services/api";

type Cliente = {
  id: number;
  nome: string;
  ativo: boolean;
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
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroSubmit, setErroSubmit] = useState("");

  useEffect(() => {
    async function buscarClientes() {
      setCarregandoOpcoes(true);
      setErroCarregamento("");

      try {
        const response = await apiFetch("/clientes");

        if (!response.ok) {
          throw new Error("Não foi possível carregar os clientes.");
        }

        const clientesApi = await response.json();
        setClientes(clientesApi);
      } catch (error) {
        console.error(error);
        setErroCarregamento("Não foi possível carregar os clientes da peça.");
      } finally {
        setCarregandoOpcoes(false);
      }
    }

    buscarClientes();
  }, []);

  async function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

    const codigoNormalizado = codigo.trim();
    const descricaoNormalizada = descricao.trim();
    const materialNormalizado = material.trim();
    const observacaoNormalizada = observacao.trim();
    const clienteIdNormalizado = Number(clienteId);

    if (codigoNormalizado === "") {
      setErroSubmit("Informe o código da peça.");
      return;
    }

    if (!Number.isInteger(clienteIdNormalizado) || clienteIdNormalizado <= 0) {
      setErroSubmit("Selecione um cliente válido.");
      return;
    }

    if (descricaoNormalizada === "") {
      setErroSubmit("Informe a descrição da peça.");
      return;
    }

    if (materialNormalizado === "") {
      setErroSubmit("Informe o material da peça.");
      return;
    }

    const peca = {
      codigo: codigoNormalizado,
      clienteId: clienteIdNormalizado,
      descricao: descricaoNormalizada,
      material: materialNormalizado,
      tratamentoTermico: tratamentoTermico || null,
      tratamentoSuperficial: tratamentoSuperficial || null,
      terceirizacao: terceirizacao || null,
      observacao: observacaoNormalizada === "" ? null : observacaoNormalizada,
    };

    setSalvando(true);

    try {
      const response = await apiFetch("/pecas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(peca),
      });

      if (!response.ok) {
        let fallbackMessage = "Não foi possível cadastrar a peça agora.";

        if (response.status === 404) {
          fallbackMessage = "Cliente não encontrado.";
        }

        if (response.status === 409) {
          fallbackMessage =
            "Já existe uma peça com esse código para o cliente informado.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/pecas");
    } catch (error) {
      console.error(error);
      setErroSubmit("Não foi possível conectar com a API para cadastrar a peça.");
    } finally {
      setSalvando(false);
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
        {erroCarregamento ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroCarregamento}
          </div>
        ) : null}

        {erroSubmit ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroSubmit}
          </div>
        ) : null}

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
              disabled={carregandoOpcoes || salvando}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              <option value="" disabled>
                {carregandoOpcoes ? "Carregando clientes..." : "Escolha o cliente..."}
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
            placeholder="Digite o material da peca..."
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
              <option value="">Sem tratamento</option>

              {tratamentoTermicoOptions.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
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
              <option value="">Sem tratamento</option>

              {tratamentoSuperficialOptions.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
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
              <option value="">Sem terceirização</option>

              {terceirizacaoOptions.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
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
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            title="Cancelar"
            disabled={salvando}
            onClick={() => navigate("/pecas")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            title="Salvar peça"
            disabled={salvando || carregandoOpcoes}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PecaForm;
