import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  isSetorProdutivo,
  setorAtualOptions,
  setorProdutivoOptions,
  statusOrdemServicoOptions,
  type StatusOrdemServico,
} from "./ordemServicoOptions";
import { apiFetch } from "../services/api";

type Peca = {
  id: number;
  codigo: string;
  clienteId: number;
};

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
};

type OrdemServicoApi = {
  id: number;
  numero: number;
  pedidoId: number;
  pecaId: number;
  quantidade: number;
  horasUnitarias: number;
  setores: string;
  dataEntregaSolicitada: string;
  dataEntregaReal: string | null;
  observacao: string | null;
  status: StatusOrdemServico;
  setorAtual: string | null;
  possuiRnc: boolean;
  possuiDevolucao: boolean;
  dataRnc: string | null;
  dataDevolucao: string | null;
};

const setoresDisponiveis = [
  "Torno Mecanico",
  "Torno CNC",
  "Centro de Usinagem",
  "Mandrilhadora",
  "Fresa",
  "Retifica Plana",
  "Retifica Cilindrica",
];

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

function toInputDate(value: string | null) {
  return value ? value.split("T")[0] : "";
}

function OrdemServicoEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [numero, setNumero] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [pecaId, setPecaId] = useState("");
  const [horasUnitarias, setHorasUnitarias] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [setores, setSetores] = useState<string[]>([]);
  const [dataEntregaSolicitada, setDataEntregaSolicitada] = useState("");
  const [dataEntregaReal, setDataEntregaReal] = useState("");
  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState<StatusOrdemServico>("NAO_INICIADA");
  const [setorAtual, setSetorAtual] = useState("");
  const [possuiRnc, setPossuiRnc] = useState(false);
  const [dataRnc, setDataRnc] = useState("");
  const [possuiDevolucao, setPossuiDevolucao] = useState(false);
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [ordemCarregada, setOrdemCarregada] = useState<OrdemServicoApi | null>(
    null,
  );
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroSubmit, setErroSubmit] = useState("");

  const horasTotais =
    (Number(horasUnitarias) || 0) * (Number(quantidade) || 0);
  const pedidoSelecionado = pedidos.find(
    (pedido) => pedido.id === Number(pedidoId),
  );
  const pecasDisponiveis = pedidoSelecionado
    ? pecas.filter((peca) => peca.clienteId === pedidoSelecionado.clienteId)
    : [];
  const podeEditarDataEntregaReal =
    ordemCarregada?.status === "CONCLUIDA" && status === "CONCLUIDA";
  const valorSetorAtual =
    status === "EM_ANDAMENTO"
      ? isSetorProdutivo(setorAtual)
        ? setorAtual
        : ""
      : status === "CONCLUIDA"
        ? "LIBERADO"
        : "";

  useEffect(() => {
    async function carregarDados() {
      if (!id) {
        setErroCarregamento("ID da ordem de serviço não informado.");
        setCarregandoDados(false);
        return;
      }

      setCarregandoDados(true);
      setErroCarregamento("");

      try {
        const [responsePedidos, responsePecas, responseOrdemServico] =
          await Promise.all([
            apiFetch("/pedidos"),
            apiFetch("/pecas"),
            apiFetch(`/ordensServico/${id}`),
          ]);

        if (!responseOrdemServico.ok) {
          throw new Error(
            await getResponseErrorMessage(
              responseOrdemServico,
              "Não foi possível carregar a ordem de serviço.",
            ),
          );
        }

        if (!responsePedidos.ok || !responsePecas.ok) {
          throw new Error(
            "Não foi possível carregar os pedidos e as peças da ordem de serviço.",
          );
        }

        const [pedidosApi, pecasApi, ordemServicoApi] = await Promise.all([
          responsePedidos.json(),
          responsePecas.json(),
          responseOrdemServico.json(),
        ]);

        setPedidos(pedidosApi);
        setPecas(pecasApi);
        setOrdemCarregada(ordemServicoApi);
        setNumero(String(ordemServicoApi.numero));
        setPedidoId(String(ordemServicoApi.pedidoId));
        setPecaId(String(ordemServicoApi.pecaId));
        setHorasUnitarias(String(ordemServicoApi.horasUnitarias));
        setQuantidade(String(ordemServicoApi.quantidade));
        setSetores(
          ordemServicoApi.setores
            ? ordemServicoApi.setores
                .split(",")
                .map((setor: string) => setor.trim())
                .filter(Boolean)
            : [],
        );
        setDataEntregaSolicitada(
          toInputDate(ordemServicoApi.dataEntregaSolicitada),
        );
        setDataEntregaReal(toInputDate(ordemServicoApi.dataEntregaReal));
        setObservacao(ordemServicoApi.observacao ?? "");
        setStatus(ordemServicoApi.status);
        setSetorAtual(ordemServicoApi.setorAtual ?? "");
        setPossuiRnc(ordemServicoApi.possuiRnc);
        setDataRnc(toInputDate(ordemServicoApi.dataRnc));
        setPossuiDevolucao(ordemServicoApi.possuiDevolucao);
        setDataDevolucao(toInputDate(ordemServicoApi.dataDevolucao));
      } catch (error) {
        console.error(error);
        setErroCarregamento(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a ordem de serviço.",
        );
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, [id]);

  function onHorasUnitariasInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setHorasUnitarias(event.target.value);
  }

  function onQuantidadeInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setQuantidade(event.target.value);
  }

  function onPedidoChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextPedidoId = event.target.value;
    setPedidoId(nextPedidoId);

    if (!nextPedidoId) {
      setPecaId("");
      return;
    }

    const nextPedido = pedidos.find(
      (pedido) => pedido.id === Number(nextPedidoId),
    );

    if (!nextPedido || !pecaId) {
      return;
    }

    const pecaSelecionada = pecas.find((peca) => peca.id === Number(pecaId));

    if (
      pecaSelecionada &&
      pecaSelecionada.clienteId !== nextPedido.clienteId
    ) {
      setPecaId("");
    }
  }

  function onSetorChange(setor: string) {
    setSetores((setoresAtuais) => {
      if (setoresAtuais.includes(setor)) {
        return setoresAtuais.filter((item) => item !== setor);
      }

      return [...setoresAtuais, setor];
    });
  }

  function onStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    setStatus(event.target.value as StatusOrdemServico);
    setErroSubmit("");
  }

  async function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

    if (!id || !ordemCarregada) {
      setErroSubmit("A ordem de serviço não foi carregada corretamente.");
      return;
    }

    const numeroNormalizado = Number(numero);
    const pedidoIdNormalizado = Number(pedidoId);
    const pecaIdNormalizado = Number(pecaId);
    const horasUnitariasNormalizadas = Number(horasUnitarias);
    const quantidadeNormalizada = Number(quantidade);
    const dataEntrega = new Date(`${dataEntregaSolicitada}T00:00:00`);

    if (!Number.isInteger(numeroNormalizado) || numeroNormalizado <= 0) {
      setErroSubmit("Informe um número de OS inteiro maior que zero.");
      return;
    }

    if (!Number.isInteger(pedidoIdNormalizado) || pedidoIdNormalizado <= 0) {
      setErroSubmit("Selecione um pedido válido.");
      return;
    }

    if (!Number.isInteger(pecaIdNormalizado) || pecaIdNormalizado <= 0) {
      setErroSubmit("Selecione uma peça válida.");
      return;
    }

    if (
      !Number.isFinite(horasUnitariasNormalizadas) ||
      horasUnitariasNormalizadas <= 0
    ) {
      setErroSubmit("Informe horas unitarias maiores que zero.");
      return;
    }

    if (
      !Number.isInteger(quantidadeNormalizada) ||
      quantidadeNormalizada <= 0
    ) {
      setErroSubmit("Informe uma quantidade inteira maior que zero.");
      return;
    }

    if (setores.length === 0) {
      setErroSubmit("Selecione pelo menos um setor.");
      return;
    }

    if (Number.isNaN(dataEntrega.getTime())) {
      setErroSubmit("Informe uma data de entrega solicitada válida.");
      return;
    }

    const pedidoAtual = pedidos.find((pedido) => pedido.id === pedidoIdNormalizado);
    const pecaAtual = pecas.find((peca) => peca.id === pecaIdNormalizado);

    if (!pedidoAtual) {
      setErroSubmit("O pedido selecionado não foi encontrado.");
      return;
    }

    if (!pecaAtual) {
      setErroSubmit("A peça selecionada não foi encontrada.");
      return;
    }

    if (pedidoAtual.clienteId !== pecaAtual.clienteId) {
      setErroSubmit(
            "Pedido e peça precisam pertencer ao mesmo cliente para a OS.",
      );
      return;
    }

    if (status === "EM_ANDAMENTO" && !isSetorProdutivo(setorAtual)) {
      setErroSubmit(
            "Ordens em andamento precisam de um setor produtivo válido.",
      );
      return;
    }

    if (possuiRnc && !dataRnc) {
      setErroSubmit("Informe a data da RNC.");
      return;
    }

    if (possuiDevolucao && !dataDevolucao) {
      setErroSubmit("Informe a data da devolução.");
      return;
    }

    const observacaoNormalizada = observacao.trim();
    const ordemServico: Record<string, unknown> = {
      numero: numeroNormalizado,
      pedidoId: pedidoIdNormalizado,
      pecaId: pecaIdNormalizado,
      horasUnitarias: horasUnitariasNormalizadas,
      quantidade: quantidadeNormalizada,
      setores: setores.join(", "),
      dataEntregaSolicitada: dataEntrega.toISOString(),
      status,
      possuiRnc,
      possuiDevolucao,
    };

    if (observacaoNormalizada !== "") {
      ordemServico.observacao = observacaoNormalizada;
    }

    if (status === "EM_ANDAMENTO") {
      ordemServico.setorAtual = setorAtual;
    }

    if (
      status === "CONCLUIDA" &&
      ordemCarregada.status === "CONCLUIDA"
    ) {
      if (!dataEntregaReal) {
        setErroSubmit(
            "Ordens já concluídas precisam manter uma data real de entrega.",
        );
        return;
      }

      const dataEntregaRealNormalizada = new Date(
        `${dataEntregaReal}T00:00:00`,
      );

      if (Number.isNaN(dataEntregaRealNormalizada.getTime())) {
        setErroSubmit("Informe uma data real de entrega válida.");
        return;
      }

      ordemServico.dataEntregaReal = dataEntregaRealNormalizada.toISOString();
    }

    if (possuiRnc) {
      const dataRncNormalizada = new Date(`${dataRnc}T00:00:00`);

      if (Number.isNaN(dataRncNormalizada.getTime())) {
        setErroSubmit("Informe uma data da RNC válida.");
        return;
      }

      ordemServico.dataRnc = dataRncNormalizada.toISOString();
    } else {
      ordemServico.dataRnc = null;
    }

    if (possuiDevolucao) {
      const dataDevolucaoNormalizada = new Date(`${dataDevolucao}T00:00:00`);

      if (Number.isNaN(dataDevolucaoNormalizada.getTime())) {
      setErroSubmit("Informe uma data de devolução válida.");
        return;
      }

      ordemServico.dataDevolucao = dataDevolucaoNormalizada.toISOString();
    } else {
      ordemServico.dataDevolucao = null;
    }

    setSalvando(true);

    try {
      const response = await apiFetch(`/ordensServico/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ordemServico),
      });

      if (!response.ok) {
        let fallbackMessage =
            "Não foi possível salvar as alterações da ordem de serviço.";

        if (response.status === 404) {
          fallbackMessage =
            "A ordem de serviço, o pedido ou a peça não foram encontrados.";
        }

        if (response.status === 409) {
          fallbackMessage = "Já existe uma ordem de serviço com esse número.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/ordens-servico");
    } catch (error) {
      console.error(error);
      setErroSubmit(
            "Não foi possível conectar com a API para atualizar a ordem de serviço.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return <p className="text-sm text-slate-200">Carregando ordem de serviço...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">
          Editar ordem de serviço
        </h1>

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="numero"
              className="text-sm font-medium text-slate-700"
            >
              Numero
            </label>

            <input
              id="numero"
              name="numero"
              type="number"
              min="1"
              step="1"
              value={numero}
              onFocus={(event) => event.target.select()}
              onChange={(event) => setNumero(event.target.value)}
              required
              placeholder="Digite o número da O.S."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="pedidoId"
              className="text-sm font-medium text-slate-700"
            >
              Pedido
            </label>

            <select
              id="pedidoId"
              name="pedidoId"
              value={pedidoId}
              required
              disabled={salvando}
              onChange={onPedidoChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              <option value="" disabled>
                Escolha o pedido
              </option>

              {pedidos.map((pedido) => (
                <option key={pedido.id} value={pedido.id}>
                  {pedido.codigo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="pecaId"
              className="text-sm font-medium text-slate-700"
            >
              Peça
            </label>

            <select
              id="pecaId"
              name="pecaId"
              value={pecaId}
              required
              disabled={!pedidoSelecionado || salvando}
              onChange={(event) => setPecaId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              <option value="" disabled>
                {!pedidoSelecionado
                  ? "Escolha primeiro o pedido"
                  : "Escolha a peça"}
              </option>

              {pecasDisponiveis.map((peca) => (
                <option key={peca.id} value={peca.id}>
                  {peca.codigo}
                </option>
              ))}
            </select>

            {pedidoSelecionado ? (
              <p className="text-xs text-slate-500">
                  A lista de peças foi filtrada para o cliente do pedido
                selecionado.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="horasUnitarias"
              className="text-sm font-medium text-slate-700"
            >
              Horas unitarias
            </label>

            <input
              id="horasUnitarias"
              name="horasUnitarias"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Digite o tempo por peça"
              required
              value={horasUnitarias}
              onChange={onHorasUnitariasInputChanged}
              onFocus={(event) => event.target.select()}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="quantidade"
              className="text-sm font-medium text-slate-700"
            >
              Quantidade
            </label>

            <input
              id="quantidade"
              name="quantidade"
              type="number"
              min="1"
              step="1"
              placeholder="Digite a quantidade"
              required
              value={quantidade}
              onChange={onQuantidadeInputChanged}
              onFocus={(event) => event.target.select()}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="horasTotais"
              className="text-sm font-medium text-slate-700"
            >
              Horas totais
            </label>

            <input
              id="horasTotais"
              name="horasTotais"
              type="number"
              value={Number.isFinite(horasTotais) ? horasTotais : 0}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-700">Setores</p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {setoresDisponiveis.map((setor) => (
              <label key={setor} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={setores.includes(setor)}
                  disabled={salvando}
                  onChange={() => onSetorChange(setor)}
                />
                {setor}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="dataEntregaSolicitada"
            className="text-sm font-medium text-slate-700"
          >
            Data de entrega solicitada
          </label>

          <input
            id="dataEntregaSolicitada"
            name="dataEntregaSolicitada"
            type="date"
            value={dataEntregaSolicitada}
            onChange={(event) => setDataEntregaSolicitada(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="dataEntregaReal"
            className="text-sm font-medium text-slate-700"
          >
            Data real de entrega
          </label>

          <input
            id="dataEntregaReal"
            name="dataEntregaReal"
            type="date"
            value={dataEntregaReal}
            onChange={(event) => setDataEntregaReal(event.target.value)}
            disabled={!podeEditarDataEntregaReal || salvando}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
          />

          <p className="text-xs text-slate-500">
            {podeEditarDataEntregaReal
              ? "Use este campo apenas para correcao historica da data real de entrega."
              : status === "CONCLUIDA"
                ? "Na primeira conclusão, a data real será registrada automaticamente pelo backend."
                    : "Ordens não concluídas não permitem editar a data real de entrega."}
          </p>
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
            placeholder="Digite as observações"
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={status}
              onChange={onStatusChange}
              required
              disabled={salvando}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              {statusOrdemServicoOptions.map((opcaoStatus) => (
                <option key={opcaoStatus.value} value={opcaoStatus.value}>
                  {opcaoStatus.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="setorAtual"
              className="text-sm font-medium text-slate-700"
            >
              Setor atual
            </label>

            <select
              id="setorAtual"
              name="setorAtual"
              value={valorSetorAtual}
              onChange={(event) => setSetorAtual(event.target.value)}
              disabled={status !== "EM_ANDAMENTO" || salvando}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              {status === "CONCLUIDA" ? (
                <option value="LIBERADO">
                  {
                    setorAtualOptions.find((setor) => setor.value === "LIBERADO")
                      ?.label
                  }
                </option>
              ) : null}

              {status !== "CONCLUIDA" ? (
                <option value="">
                  {status === "EM_ANDAMENTO"
                    ? "Escolha um setor produtivo"
                    : "Sem setor atual"}
                </option>
              ) : null}

              {setorProdutivoOptions.map((opcaoSetor) => (
                <option key={opcaoSetor.value} value={opcaoSetor.value}>
                  {opcaoSetor.label}
                </option>
              ))}
            </select>

            <p className="text-xs text-slate-500">
              {status === "EM_ANDAMENTO"
                    ? "Selecione um setor produtivo válido para manter a OS em andamento."
                : status === "CONCLUIDA"
                  ? "Ordens concluídas permanecem no setor Liberado."
                    : "Ordens não iniciadas e canceladas ficam sem setor atual."}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={possuiRnc}
            disabled={salvando}
            onChange={(event) => setPossuiRnc(event.target.checked)}
          />
          Possui RNC?
        </label>

        {possuiRnc ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Data da RNC
            </label>

            <input
              type="date"
              value={dataRnc}
              onChange={(event) => setDataRnc(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        ) : null}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={possuiDevolucao}
            disabled={salvando}
            onChange={(event) => setPossuiDevolucao(event.target.checked)}
          />
              Possui devolução
        </label>

        {possuiDevolucao ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Data da devolução
            </label>

            <input
              type="date"
              value={dataDevolucao}
              onChange={(event) => setDataDevolucao(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            title="Cancelar"
            disabled={salvando}
            onClick={() => navigate("/ordens-servico")}
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

export default OrdemServicoEditForm;
