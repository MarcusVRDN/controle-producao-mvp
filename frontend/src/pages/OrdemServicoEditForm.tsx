import { useNavigate, useParams } from "react-router-dom";
import {
  useState,
  type ChangeEvent,
  useEffect,
  type SyntheticEvent,
} from "react";

type Peca = {
  id: number;
  codigo: string;
  clienteId: number;
  descricao: string;
  material: string;
  tratamentoTermico: string;
  tratamentoSuperficial: string;
  terceirizacao: string;
  observacao: string;
};

type Pedido = {
  id: number;
  codigo: string;
  clienteId: number;
  observacao: string;
  status: string;
};

const statusOrdemServico = [
  { valor: "NAO_INICIADA", texto: "Não iniciada" },
  { valor: "EM_ANDAMENTO", texto: "Em andamento" },
  { valor: "CONCLUIDA", texto: "Concluída" },
  { valor: "CANCELADA", texto: "Cancelada" },
];

const setoresAtuais = [
  { valor: "TORNO", texto: "Torno" },
  { valor: "FRESA", texto: "Fresa" },
  { valor: "RETIFICA", texto: "Retífica" },
  { valor: "CENTRO_USINAGEM", texto: "Centro de usinagem" },
  { valor: "TORNO_CNC", texto: "Torno CNC" },
  { valor: "MANDRILHADORA", texto: "Mandrilhadora" },
  { valor: "AJUSTAGEM", texto: "Ajustagem" },
  { valor: "ROSQUEADEIRA", texto: "Rosqueadeira" },
  { valor: "QUALIDADE", texto: "Qualidade" },
  { valor: "LIBERADO", texto: "Liberado" },
];

function OrdemServicoEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [numero, setNumero] = useState(0);
  const [pedidoId, setPedidoId] = useState("");
  const [pecaId, setPecaId] = useState("");
  const [horasUnitarias, setHorasUnitarias] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [setores, setSetores] = useState<string[]>([]);
  const [dataEntregaSolicitada, setDataEntregaSolicitada] = useState("");
  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState("");
  const [setorAtual, setSetorAtual] = useState("");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  const horasTotais = horasUnitarias * quantidade;

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const response = await fetch("http://localhost:3001/pedidos");

        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos");
        }

        const pedidosApi = await response.json();
        setPedidos(pedidosApi);
      } catch (error) {
        console.error(error);
      }
    }

    buscarPedidos();
  }, []);

  useEffect(() => {
    async function buscarPecas() {
      try {
        const response = await fetch("http://localhost:3001/pecas");

        if (!response.ok) {
          throw new Error("Erro ao buscar peças");
        }

        const pecasApi = await response.json();
        setPecas(pecasApi);
      } catch (error) {
        console.error(error);
      }
    }

    buscarPecas();
  }, []);

  useEffect(() => {
    async function buscarOrdemServico() {
      if (!id) {
        console.error("ID da ordem de serviço não informado");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/ordensServico/${id}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar ordem de serviço");
        }

        const ordemServicoApi = await response.json();

        setNumero(ordemServicoApi.numero);
        setPedidoId(String(ordemServicoApi.pedidoId));
        setPecaId(String(ordemServicoApi.pecaId));
        setHorasUnitarias(ordemServicoApi.horasUnitarias);
        setQuantidade(ordemServicoApi.quantidade);
        setSetores(
          ordemServicoApi.setores
            ? ordemServicoApi.setores.split(", ")
            : [],
        );
        setDataEntregaSolicitada(
          ordemServicoApi.dataEntregaSolicitada.split("T")[0],
        );
        setObservacao(ordemServicoApi.observacao ?? "");
        setStatus(ordemServicoApi.status);
        setSetorAtual(ordemServicoApi.setorAtual ?? "");
      } catch (error) {
        console.error(error);
      }
    }

    buscarOrdemServico();
  }, [id]);

  async function onHandleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      console.error("ID da ordem de serviço não informado");
      return;
    }

    const ordemServico = {
      numero,
      pedidoId: Number(pedidoId),
      pecaId: Number(pecaId),
      horasUnitarias,
      quantidade,
      horasTotais,
      setores: setores.join(", "),
      dataEntregaSolicitada: new Date(
        `${dataEntregaSolicitada}T00:00:00`,
      ).toISOString(),
      observacao,
      status,
      setorAtual: setorAtual || null,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/ordensServico/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ordemServico),
        },
      );

      if (!response.ok) {
        const erro = await response.json();
        console.error(erro);
        return;
      }

      const ordemAtualizada = await response.json();
      console.log(ordemAtualizada);
      navigate("/ordens-servico");
    } catch (error) {
      console.error("Erro ao atualizar ordem de serviço", error);
    }
  }

  function onHorasUnitariasInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setHorasUnitarias(Number(event.target.value));
  }

  function onQuantidadeInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setQuantidade(Number(event.target.value));
  }

  function onSetorChange(setor: string) {
    setSetores((setoresAtuais) => {
      if (setoresAtuais.includes(setor)) {
        return setoresAtuais.filter((item) => item !== setor);
      }

      return [...setoresAtuais, setor];
    });
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">
          Editar ordem de serviço
        </h1>

        <p className="text-sm text-slate-300">Edite os campos desejados.</p>
      </div>

      <form
        className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-300 bg-white p-6 shadow-md"
        onSubmit={onHandleSubmit}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="numero"
              className="text-sm font-medium text-slate-700"
            >
              Número
            </label>

            <input
              id="numero"
              name="numero"
              type="number"
              value={numero}
              onFocus={(event) => event.target.select()}
              onChange={(event) => setNumero(Number(event.target.value))}
              required
              placeholder="Digite o número da O.S...."
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
              onChange={(event) => setPedidoId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha o pedido...
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
              onChange={(event) => setPecaId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="" disabled>
                Escolha a peça...
              </option>

              {pecas.map((peca) => (
                <option key={peca.id} value={peca.id}>
                  {peca.codigo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="horasUnitarias"
              className="text-sm font-medium text-slate-700"
            >
              Horas Unitárias
            </label>

            <input
              id="horasUnitarias"
              name="horasUnitarias"
              type="number"
              step="0.01"
              min="0"
              placeholder="Digite o tempo por peça..."
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
              placeholder="Digite a quantidade..."
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
              Horas Totais
            </label>

            <input
              id="horasTotais"
              name="horasTotais"
              type="number"
              value={horasTotais}
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-700">Setores</p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Torno Mecânico")}
                onChange={() => onSetorChange("Torno Mecânico")}
              />
              Torno Mecânico
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Torno CNC")}
                onChange={() => onSetorChange("Torno CNC")}
              />
              Torno CNC
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Centro de Usinagem")}
                onChange={() => onSetorChange("Centro de Usinagem")}
              />
              Centro de Usinagem
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Mandrilhadora")}
                onChange={() => onSetorChange("Mandrilhadora")}
              />
              Mandrilhadora
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Fresa")}
                onChange={() => onSetorChange("Fresa")}
              />
              Fresa
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Retífica Plana")}
                onChange={() => onSetorChange("Retífica Plana")}
              />
              Retífica Plana
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setores.includes("Retífica Cilíndrica")}
                onChange={() => onSetorChange("Retífica Cilíndrica")}
              />
              Retífica Cilíndrica
            </label>
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
              onChange={(event) => setStatus(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              {statusOrdemServico.map((opcaoStatus) => (
                <option key={opcaoStatus.valor} value={opcaoStatus.valor}>
                  {opcaoStatus.texto}
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
              value={setorAtual}
              onChange={(event) => setSetorAtual(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Sem setor atual</option>

              {setoresAtuais.map((opcaoSetor) => (
                <option key={opcaoSetor.valor} value={opcaoSetor.valor}>
                  {opcaoSetor.texto}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            title="Cancelar"
            onClick={() => navigate("/ordens-servico")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            title="Salvar alterações"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}

export default OrdemServicoEditForm;
