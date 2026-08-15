import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

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

function OrdemServicoForm() {
  const navigate = useNavigate();
  const [numero, setNumero] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [pecaId, setPecaId] = useState("");
  const [horasUnitarias, setHorasUnitarias] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [setores, setSetores] = useState<string[]>([]);
  const [dataEntregaSolicitada, setDataEntregaSolicitada] = useState("");
  const [observacao, setObservacao] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
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

  useEffect(() => {
    async function carregarOpcoes() {
      setCarregandoOpcoes(true);
      setErroCarregamento("");

      try {
        const [responsePedidos, responsePecas] = await Promise.all([
          fetch("http://localhost:3001/pedidos"),
          fetch("http://localhost:3001/pecas"),
        ]);

        if (!responsePedidos.ok || !responsePecas.ok) {
          throw new Error(
            "Nao foi possivel carregar os pedidos e as pecas da ordem de servico.",
          );
        }

        const [pedidosApi, pecasApi] = await Promise.all([
          responsePedidos.json(),
          responsePecas.json(),
        ]);

        setPedidos(pedidosApi);
        setPecas(pecasApi);
      } catch (error) {
        console.error(error);
        setErroCarregamento(
          "Nao foi possivel carregar os dados necessarios para cadastrar a ordem de servico.",
        );
      } finally {
        setCarregandoOpcoes(false);
      }
    }

    carregarOpcoes();
  }, []);

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

  async function onHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroSubmit("");

    const numeroNormalizado = Number(numero);
    const pedidoIdNormalizado = Number(pedidoId);
    const pecaIdNormalizado = Number(pecaId);
    const horasUnitariasNormalizadas = Number(horasUnitarias);
    const quantidadeNormalizada = Number(quantidade);
    const dataEntrega = new Date(`${dataEntregaSolicitada}T00:00:00`);

    if (!Number.isInteger(numeroNormalizado) || numeroNormalizado <= 0) {
      setErroSubmit("Informe um numero de OS inteiro maior que zero.");
      return;
    }

    if (!Number.isInteger(pedidoIdNormalizado) || pedidoIdNormalizado <= 0) {
      setErroSubmit("Selecione um pedido valido.");
      return;
    }

    if (!Number.isInteger(pecaIdNormalizado) || pecaIdNormalizado <= 0) {
      setErroSubmit("Selecione uma peca valida.");
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
      setErroSubmit("Informe uma data de entrega solicitada valida.");
      return;
    }

    const pedidoAtual = pedidos.find((pedido) => pedido.id === pedidoIdNormalizado);
    const pecaAtual = pecas.find((peca) => peca.id === pecaIdNormalizado);

    if (!pedidoAtual) {
      setErroSubmit("O pedido selecionado nao foi encontrado.");
      return;
    }

    if (!pecaAtual) {
      setErroSubmit("A peca selecionada nao foi encontrada.");
      return;
    }

    if (pedidoAtual.clienteId !== pecaAtual.clienteId) {
      setErroSubmit(
        "Pedido e peca precisam pertencer ao mesmo cliente para criar a OS.",
      );
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
    };

    if (observacaoNormalizada !== "") {
      ordemServico.observacao = observacaoNormalizada;
    }

    setSalvando(true);

    try {
      const response = await fetch("http://localhost:3001/ordensServico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ordemServico),
      });

      if (!response.ok) {
        let fallbackMessage =
          "Nao foi possivel salvar a ordem de servico agora.";

        if (response.status === 404) {
          fallbackMessage =
            "Pedido ou peca nao encontrados. Atualize os dados e tente novamente.";
        }

        if (response.status === 409) {
          fallbackMessage = "Ja existe uma ordem de servico com esse numero.";
        }

        const message = await getResponseErrorMessage(response, fallbackMessage);
        setErroSubmit(message);
        return;
      }

      navigate("/ordens-servico");
    } catch (error) {
      console.error(error);
      setErroSubmit(
        "Nao foi possivel conectar com a API para salvar a ordem de servico.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">
          Cadastrar ordem de servico
        </h1>

        <p className="text-sm text-slate-300">
          Preencha os dados abaixo para criar uma nova ordem de servico.
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
              placeholder="Digite o numero da O.S."
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
              disabled={carregandoOpcoes || salvando}
              onChange={onPedidoChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              <option value="" disabled>
                {carregandoOpcoes ? "Carregando pedidos..." : "Escolha o pedido"}
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
              Peca
            </label>

            <select
              id="pecaId"
              name="pecaId"
              value={pecaId}
              required
              disabled={!pedidoSelecionado || carregandoOpcoes || salvando}
              onChange={(event) => setPecaId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
            >
              <option value="" disabled>
                {!pedidoSelecionado
                  ? "Escolha primeiro o pedido"
                  : "Escolha a peca"}
              </option>

              {pecasDisponiveis.map((peca) => (
                <option key={peca.id} value={peca.id}>
                  {peca.codigo}
                </option>
              ))}
            </select>

            {pedidoSelecionado ? (
              <p className="text-xs text-slate-500">
                A lista de pecas foi filtrada para o cliente do pedido
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
              placeholder="Digite o tempo por peca"
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
            htmlFor="observacao"
            className="text-sm font-medium text-slate-700"
          >
            Observacao
          </label>

          <textarea
            id="observacao"
            name="observacao"
            rows={4}
            placeholder="Digite as observacoes"
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
            onClick={() => navigate("/ordens-servico")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            title="Salvar ordem de servico"
            disabled={salvando || carregandoOpcoes}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default OrdemServicoForm;
