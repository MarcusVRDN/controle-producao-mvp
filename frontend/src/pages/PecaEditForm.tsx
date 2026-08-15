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
        setErroCarregamento("ID da peca nao informado.");
        setCarregandoDados(false);
        return;
      }

      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const [responseClientes, responsePeca] = await Promise.all([
          fetch("http://localhost:3001/clientes"),
          fetch(`http://localhost:3001/pecas/${id}`),
        ]);

        if (!responsePeca.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responsePeca,
              "Nao foi possivel carregar a peca.",
            ),
          );
        }

        if (!responseClientes.ok) {
          throw new Error("Nao foi possivel carregar os clientes da peca.");
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
          error instanceof Error ? error.message : "Nao foi possivel carregar a peca.",
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
      setErroSubmit("ID da peca nao informado.");
      return;
    }

    const codigoNormalizado = codigo.trim();
    const descricaoNormalizada = descricao.trim();
    const materialNormalizado = material.trim();
    const observacaoNormalizada = observacao.trim();
    const clienteIdNormalizado = Number(clienteId);

    if (codigoNormalizado === "") {
      setErroSubmit("Informe o codigo da peca.");
      return;
    }

    if (!Number.isInteger(clienteIdNormalizado) || clienteIdNormalizado <= 0) {
      setErroSubmit("Selecione um cliente valido.");
      return;
    }

    if (descricaoNormalizada === "") {
      setErroSubmit("Informe a descricao da peca.");
      return;
    }

    if (materialNormalizado === "") {
      setErroSubmit("Informe o material da peca.");
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
      const response = await fetch(`http://localhost:3001/pecas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(peca),
      });

      if (!response.ok) {
        let fallbackMessage = "Nao foi possivel atualizar a peca agora.";

        if (response.status === 404) {
          fallbackMessage = "Peca ou cliente nao encontrados.";
        }

        if (response.status === 409) {
          fallbackMessage =
            "Ja existe uma peca com esse codigo para o cliente informado.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/pecas");
    } catch (error) {
      console.error(error);
      setErroSubmit("Nao foi possivel conectar com a API para atualizar a peca.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando peca...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Editar Peca</h1>

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
              Codigo
            </label>

            <input
              id="codigo"
              name="codigo"
              type="text"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value)}
              placeholder="Digite o codigo da peca..."
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
            Descricao
          </label>

          <input
            id="descricao"
            name="descricao"
            type="text"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Digite a descricao da peca..."
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
              Tratamento Termico
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
              Terceirizacao
            </label>

            <select
              id="terceirizacao"
              name="terceirizacao"
              value={terceirizacao}
              onChange={(event) => setTerceirizacao(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Sem terceirizacao</option>

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
            Observacao
          </label>

          <textarea
            id="observacao"
            name="observacao"
            rows={4}
            placeholder="Digite as observacoes..."
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
            title="Salvar alteracoes"
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
