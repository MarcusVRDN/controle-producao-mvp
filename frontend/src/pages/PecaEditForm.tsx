import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  normalizeTerceirizacaoValue,
  normalizeTratamentoSuperficialValue,
  normalizeTratamentoTermicoValue,
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

type PecaApi = {
  codigo: string;
  clienteId: number;
  descricao: string;
  material: string;
  tratamentoTermico: string | null;
  tratamentoSuperficial: string | null;
  terceirizacao: string | null;
  observacao: string | null;
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

function PecaEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [codigo, setCodigo] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [material, setMaterial] = useState("");
  const [tratamentoTermico, setTratamentoTermico] = useState("");
  const [tratamentoSuperficial, setTratamentoSuperficial] = useState("");
  const [terceirizacao, setTerceirizacao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroSubmit, setErroSubmit] = useState("");

  useEffect(() => {
    async function carregarDados() {
      if (!id) {
        setErroCarregamento("ID da peça não informado.");
        setCarregandoDados(false);
        return;
      }

      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const [responseClientes, responsePeca] = await Promise.all([
          apiFetch("/clientes"),
          apiFetch(`/pecas/${id}`),
        ]);

        if (!responsePeca.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responsePeca,
              "Não foi possível carregar a peça.",
            ),
          );
        }

        if (!responseClientes.ok) {
          throw new Error("Não foi possível carregar os clientes da peça.");
        }

        const [clientesApi, pecaApi] = await Promise.all([
          responseClientes.json(),
          responsePeca.json(),
        ]);

        const dadosPeca = pecaApi as PecaApi;

        setClientes(clientesApi);
        setCodigo(dadosPeca.codigo);
        setClienteId(String(dadosPeca.clienteId));
        setDescricao(dadosPeca.descricao);
        setMaterial(dadosPeca.material);
        setTratamentoTermico(
          normalizeTratamentoTermicoValue(dadosPeca.tratamentoTermico),
        );
        setTratamentoSuperficial(
          normalizeTratamentoSuperficialValue(
            dadosPeca.tratamentoSuperficial,
          ),
        );
        setTerceirizacao(normalizeTerceirizacaoValue(dadosPeca.terceirizacao));
        setObservacao(dadosPeca.observacao ?? "");
      } catch (error) {
        console.error(error);
        setErroCarregamento(
          error instanceof Error ? error.message : "Não foi possível carregar a peça.",
        );
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, [id]);

  async function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

    if (!id) {
      setErroSubmit("ID da peça não informado.");
      return;
    }

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
      const response = await apiFetch(`/pecas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(peca),
      });

      if (!response.ok) {
        let fallbackMessage = "Não foi possível atualizar a peça agora.";

        if (response.status === 404) {
          fallbackMessage = "Peça ou cliente não encontrados.";
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
      setErroSubmit("Não foi possível conectar com a API para atualizar a peça.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando peça...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Editar Peça</h1>

        <p className="text-sm text-slate-300">Edite os campos desejados.</p>
      </div>

      {erroCarregamento ? (
        <div className="w-full max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroCarregamento}
        </div>
      ) : null}

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={onHandleSubmit}
      >
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
              disabled={salvando}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
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
            title="Salvar alterações"
            disabled={salvando || !!erroCarregamento}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PecaEditForm;
