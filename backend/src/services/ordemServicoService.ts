import { ordemServicoRepository } from "../repositories/ordemServico.repository.js";
import { pedidoRepository } from "../repositories/pedido.repository.js";
import { pecaRepository } from "../repositories/peca.repository.js";
import { SetorOrdemServico, StatusOrdemServico } from "@prisma/client";

type DateInput = Date | string | null | undefined;

type OrdemServicoInput = {
  numero?: unknown;
  pedidoId?: unknown;
  pecaId?: unknown;
  quantidade?: unknown;
  horasUnitarias?: unknown;
  horasTotais?: unknown;
  setores?: unknown;
  dataEntregaSolicitada?: DateInput;
  dataEntregaReal?: DateInput;
  observacao?: unknown;
  status?: unknown;
  setorAtual?: unknown;
  possuiRnc?: unknown;
  possuiDevolucao?: unknown;
  dataRnc?: DateInput;
  dataDevolucao?: DateInput;
};

type OrdemServicoStatusPatchInput = {
  status?: unknown;
  setorAtual?: unknown;
};

type OrdemServicoPersistedData = {
  numero: number;
  pedidoId: number;
  pecaId: number;
  quantidade: number;
  horasUnitarias: number;
  horasTotais: number;
  setores: string;
  dataEntregaSolicitada: Date;
  dataEntregaReal: Date | null;
  observacao?: string;
  status: StatusOrdemServico;
  setorAtual: SetorOrdemServico | null;
  possuiRnc: boolean;
  possuiDevolucao: boolean;
  dataRnc: Date | null;
  dataDevolucao: Date | null;
};

type OrdemServicoRecord = NonNullable<
  Awaited<ReturnType<typeof ordemServicoRepository.findById>>
>;

const statusValues = new Set<StatusOrdemServico>(
  Object.values(StatusOrdemServico),
);
const setorValues = new Set<SetorOrdemServico>(
  Object.values(SetorOrdemServico),
);
const patchAllowedKeys = new Set(["status", "setorAtual"]);

export class OrdemServicoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrdemServicoValidationError";
  }
}

export class OrdemServicoNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrdemServicoNotFoundError";
  }
}

function hasOwnKey(
  value: Record<string, unknown>,
  key: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function ensureObjectPayload(
  value: unknown,
  message = "Dados da ordem de servico invalidos",
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OrdemServicoValidationError(message);
  }
}

function requirePositiveInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new OrdemServicoValidationError(
      `${fieldName} deve ser um inteiro maior que zero`,
    );
  }

  return value;
}

function requirePositiveFiniteNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new OrdemServicoValidationError(
      `${fieldName} deve ser um numero finito maior que zero`,
    );
  }

  return value;
}

function parseRequiredDate(value: unknown, fieldName: string): Date {
  if (value === undefined || value === null) {
    throw new OrdemServicoValidationError(`${fieldName} e obrigatoria`);
  }

  if (!(value instanceof Date) && typeof value !== "string") {
    throw new OrdemServicoValidationError(
      `${fieldName} deve conter uma data valida`,
    );
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new OrdemServicoValidationError(
      `${fieldName} deve conter uma data valida`,
    );
  }

  return parsedDate;
}

function parseOptionalDate(value: unknown, fieldName: string): Date | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (!(value instanceof Date) && typeof value !== "string") {
    throw new OrdemServicoValidationError(
      `${fieldName} deve conter uma data valida`,
    );
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new OrdemServicoValidationError(
      `${fieldName} deve conter uma data valida`,
    );
  }

  return parsedDate;
}

function parseStatus(value: unknown): StatusOrdemServico {
  if (typeof value !== "string" || !statusValues.has(value as StatusOrdemServico)) {
    throw new OrdemServicoValidationError("Status da ordem de servico invalido");
  }

  return value as StatusOrdemServico;
}

function parseNullableSetorAtual(value: unknown): SetorOrdemServico | null {
  if (value === null) {
    return null;
  }

  if (
    typeof value !== "string" ||
    !setorValues.has(value as SetorOrdemServico)
  ) {
    throw new OrdemServicoValidationError("Setor atual invalido");
  }

  return value as SetorOrdemServico;
}

function parseBoolean(
  value: unknown,
  fieldName: string,
  fallbackValue: boolean,
): boolean {
  if (value === undefined) {
    return fallbackValue;
  }

  if (typeof value !== "boolean") {
    throw new OrdemServicoValidationError(`${fieldName} deve ser booleano`);
  }

  return value;
}

function normalizeSetores(value: unknown): string {
  if (typeof value !== "string") {
    throw new OrdemServicoValidationError("Setores deve ser uma string valida");
  }

  const setores = value
    .split(",")
    .map((setor) => setor.trim())
    .filter(Boolean);

  if (setores.length === 0) {
    throw new OrdemServicoValidationError(
      "Informe pelo menos um setor valido",
    );
  }

  return setores.join(", ");
}

function normalizeObservacao(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new OrdemServicoValidationError("Observacao invalida");
  }

  return value;
}

async function ensurePedidoAndPecaBelongToSameCliente(
  pedidoId: number,
  pecaId: number,
) {
  const pedido = await pedidoRepository.findById(pedidoId);

  if (!pedido) {
    throw new OrdemServicoNotFoundError("Pedido nao encontrado");
  }

  const peca = await pecaRepository.findById(pecaId);

  if (!peca) {
    throw new OrdemServicoNotFoundError("Peca nao encontrada");
  }

  if (pedido.clienteId !== peca.clienteId) {
    throw new OrdemServicoValidationError(
      "Pedido e peca devem pertencer ao mesmo cliente",
    );
  }
}

function resolveStatus(
  payload: Record<string, unknown>,
  current?: OrdemServicoRecord,
): StatusOrdemServico {
  if (hasOwnKey(payload, "status")) {
    return parseStatus(payload.status);
  }

  if (current) {
    return current.status;
  }

  return StatusOrdemServico.NAO_INICIADA;
}

function resolveSetorAtual(
  payload: Record<string, unknown>,
  current?: OrdemServicoRecord,
) {
  if (hasOwnKey(payload, "setorAtual")) {
    return parseNullableSetorAtual(payload.setorAtual);
  }

  return current?.setorAtual ?? null;
}

function resolveDataEntregaReal(
  payload: Record<string, unknown>,
  current?: OrdemServicoRecord,
) {
  if (hasOwnKey(payload, "dataEntregaReal")) {
    return parseOptionalDate(payload.dataEntregaReal, "Data de entrega real");
  }

  return current?.dataEntregaReal ?? null;
}

function resolveDataRnc(
  payload: Record<string, unknown>,
  current?: OrdemServicoRecord,
) {
  if (hasOwnKey(payload, "dataRnc")) {
    return parseOptionalDate(payload.dataRnc, "Data da RNC");
  }

  return current?.dataRnc ?? null;
}

function resolveDataDevolucao(
  payload: Record<string, unknown>,
  current?: OrdemServicoRecord,
) {
  if (hasOwnKey(payload, "dataDevolucao")) {
    return parseOptionalDate(payload.dataDevolucao, "Data da devolucao");
  }

  return current?.dataDevolucao ?? null;
}

function applyStatusRules(args: {
  current?: OrdemServicoRecord;
  payload: Record<string, unknown>;
  status: StatusOrdemServico;
  setorAtual: SetorOrdemServico | null;
  dataEntregaReal: Date | null;
}) {
  const { current, payload, status } = args;
  const setorAtualProvided = hasOwnKey(payload, "setorAtual");
  const dataEntregaRealProvided = hasOwnKey(payload, "dataEntregaReal");
  let { setorAtual, dataEntregaReal } = args;

  if (status === StatusOrdemServico.CONCLUIDA) {
    setorAtual = SetorOrdemServico.LIBERADO;
    dataEntregaReal =
      current?.status === StatusOrdemServico.CONCLUIDA && current.dataEntregaReal
        ? current.dataEntregaReal
        : new Date();

    return { setorAtual, dataEntregaReal };
  }

  if (status === StatusOrdemServico.EM_ANDAMENTO) {
    if (dataEntregaRealProvided && dataEntregaReal !== null) {
      throw new OrdemServicoValidationError(
        "Ordens em andamento nao podem possuir data de entrega real",
      );
    }

    dataEntregaReal = null;

    if (!setorAtual) {
      throw new OrdemServicoValidationError(
        "Ordens em andamento exigem um setor atual valido",
      );
    }

    if (setorAtual === SetorOrdemServico.LIBERADO) {
      throw new OrdemServicoValidationError(
        "Ordens em andamento nao podem ficar no setor LIBERADO",
      );
    }

    return { setorAtual, dataEntregaReal };
  }

  if (setorAtualProvided && setorAtual !== null) {
    throw new OrdemServicoValidationError(
      `Status ${status} nao permite setor atual preenchido`,
    );
  }

  if (dataEntregaRealProvided && dataEntregaReal !== null) {
    throw new OrdemServicoValidationError(
      `Status ${status} nao permite data de entrega real preenchida`,
    );
  }

  return {
    setorAtual: null,
    dataEntregaReal: null,
  };
}

function applyRncRules(args: {
  payload: Record<string, unknown>;
  possuiRnc: boolean;
  dataRnc: Date | null;
}) {
  const { payload, possuiRnc } = args;
  const dataRncProvided = hasOwnKey(payload, "dataRnc");
  let { dataRnc } = args;

  if (possuiRnc) {
    if (!dataRnc) {
      throw new OrdemServicoValidationError(
        "Data da RNC e obrigatoria quando possuiRnc for true",
      );
    }

    return dataRnc;
  }

  if (dataRncProvided && dataRnc !== null) {
    throw new OrdemServicoValidationError(
      "Data da RNC nao deve ser informada quando possuiRnc for false",
    );
  }

  dataRnc = null;
  return dataRnc;
}

function applyDevolucaoRules(args: {
  payload: Record<string, unknown>;
  possuiDevolucao: boolean;
  dataDevolucao: Date | null;
}) {
  const { payload, possuiDevolucao } = args;
  const dataDevolucaoProvided = hasOwnKey(payload, "dataDevolucao");
  let { dataDevolucao } = args;

  if (possuiDevolucao) {
    if (!dataDevolucao) {
      throw new OrdemServicoValidationError(
        "Data da devolucao e obrigatoria quando possuiDevolucao for true",
      );
    }

    return dataDevolucao;
  }

  if (dataDevolucaoProvided && dataDevolucao !== null) {
    throw new OrdemServicoValidationError(
      "Data da devolucao nao deve ser informada quando possuiDevolucao for false",
    );
  }

  dataDevolucao = null;
  return dataDevolucao;
}

async function buildFinalState(
  payload: Record<string, unknown>,
  current?: OrdemServicoRecord,
): Promise<OrdemServicoPersistedData> {
  const numero = hasOwnKey(payload, "numero")
    ? requirePositiveInteger(payload.numero, "Numero da ordem de servico")
    : current?.numero;

  if (numero === undefined) {
    throw new OrdemServicoValidationError(
      "Numero da ordem de servico e obrigatorio",
    );
  }

  const pedidoId = hasOwnKey(payload, "pedidoId")
    ? requirePositiveInteger(payload.pedidoId, "pedidoId")
    : current?.pedidoId;

  if (pedidoId === undefined) {
    throw new OrdemServicoValidationError("pedidoId e obrigatorio");
  }

  const pecaId = hasOwnKey(payload, "pecaId")
    ? requirePositiveInteger(payload.pecaId, "pecaId")
    : current?.pecaId;

  if (pecaId === undefined) {
    throw new OrdemServicoValidationError("pecaId e obrigatorio");
  }

  await ensurePedidoAndPecaBelongToSameCliente(pedidoId, pecaId);

  const quantidade = hasOwnKey(payload, "quantidade")
    ? requirePositiveInteger(payload.quantidade, "Quantidade")
    : current?.quantidade;

  if (quantidade === undefined) {
    throw new OrdemServicoValidationError("Quantidade e obrigatoria");
  }

  const horasUnitarias = hasOwnKey(payload, "horasUnitarias")
    ? requirePositiveFiniteNumber(payload.horasUnitarias, "Horas unitarias")
    : current?.horasUnitarias;

  if (horasUnitarias === undefined) {
    throw new OrdemServicoValidationError("Horas unitarias e obrigatoria");
  }

  const setoresSource = hasOwnKey(payload, "setores") ? payload.setores : current?.setores;
  const setores = normalizeSetores(setoresSource);
  const dataEntregaSolicitadaSource = hasOwnKey(payload, "dataEntregaSolicitada")
    ? payload.dataEntregaSolicitada
    : current?.dataEntregaSolicitada;
  const dataEntregaSolicitada = parseRequiredDate(
    dataEntregaSolicitadaSource,
    "Data de entrega solicitada",
  );
  const status = resolveStatus(payload, current);
  const setorAtual = resolveSetorAtual(payload, current);
  const dataEntregaReal = resolveDataEntregaReal(payload, current);
  const observacaoSource = hasOwnKey(payload, "observacao")
    ? payload.observacao
    : current?.observacao;
  const observacao = normalizeObservacao(observacaoSource);
  const possuiRnc = parseBoolean(
    payload.possuiRnc,
    "possuiRnc",
    current?.possuiRnc ?? false,
  );
  const possuiDevolucao = parseBoolean(
    payload.possuiDevolucao,
    "possuiDevolucao",
    current?.possuiDevolucao ?? false,
  );
  const dataRnc = resolveDataRnc(payload, current);
  const dataDevolucao = resolveDataDevolucao(payload, current);
  const statusFields = applyStatusRules({
    current,
    payload,
    status,
    setorAtual,
    dataEntregaReal,
  });
  const normalizedDataRnc = applyRncRules({
    payload,
    possuiRnc,
    dataRnc,
  });
  const normalizedDataDevolucao = applyDevolucaoRules({
    payload,
    possuiDevolucao,
    dataDevolucao,
  });

  return {
    numero,
    pedidoId,
    pecaId,
    quantidade,
    horasUnitarias,
    horasTotais: quantidade * horasUnitarias,
    setores,
    dataEntregaSolicitada,
    dataEntregaReal: statusFields.dataEntregaReal,
    observacao,
    status,
    setorAtual: statusFields.setorAtual,
    possuiRnc,
    possuiDevolucao,
    dataRnc: normalizedDataRnc,
    dataDevolucao: normalizedDataDevolucao,
  };
}

function toCreateRepositoryData(data: OrdemServicoPersistedData) {
  const createData: {
    numero: number;
    pedidoId: number;
    pecaId: number;
    quantidade: number;
    horasUnitarias: number;
    horasTotais: number;
    setores: string;
    dataEntregaSolicitada: Date;
    observacao?: string;
    status: StatusOrdemServico;
    setorAtual?: SetorOrdemServico;
    possuiRnc: boolean;
    possuiDevolucao: boolean;
    dataEntregaReal?: Date;
    dataRnc?: Date;
    dataDevolucao?: Date;
  } = {
    numero: data.numero,
    pedidoId: data.pedidoId,
    pecaId: data.pecaId,
    quantidade: data.quantidade,
    horasUnitarias: data.horasUnitarias,
    horasTotais: data.horasTotais,
    setores: data.setores,
    dataEntregaSolicitada: data.dataEntregaSolicitada,
    observacao: data.observacao,
    status: data.status,
    possuiRnc: data.possuiRnc,
    possuiDevolucao: data.possuiDevolucao,
  };

  if (data.setorAtual !== null) {
    createData.setorAtual = data.setorAtual;
  }

  if (data.dataEntregaReal !== null) {
    createData.dataEntregaReal = data.dataEntregaReal;
  }

  if (data.dataRnc !== null) {
    createData.dataRnc = data.dataRnc;
  }

  if (data.dataDevolucao !== null) {
    createData.dataDevolucao = data.dataDevolucao;
  }

  return createData;
}

function toUpdateRepositoryData(data: OrdemServicoPersistedData) {
  return {
    numero: data.numero,
    pedidoId: data.pedidoId,
    pecaId: data.pecaId,
    quantidade: data.quantidade,
    horasUnitarias: data.horasUnitarias,
    horasTotais: data.horasTotais,
    setores: data.setores,
    dataEntregaSolicitada: data.dataEntregaSolicitada,
    dataEntregaReal: data.dataEntregaReal,
    observacao: data.observacao,
    status: data.status,
    setorAtual: data.setorAtual,
    possuiRnc: data.possuiRnc,
    possuiDevolucao: data.possuiDevolucao,
    dataRnc: data.dataRnc,
    dataDevolucao: data.dataDevolucao,
  } as Parameters<typeof ordemServicoRepository.update>[1];
}

export const ordemServicoService = {
  async create(data: OrdemServicoInput) {
    ensureObjectPayload(data);

    const finalState = await buildFinalState(data);

    return ordemServicoRepository.create(toCreateRepositoryData(finalState));
  },

  async findAll() {
    return ordemServicoRepository.findAll();
  },

  async findById(id: number) {
    const ordemServico = await ordemServicoRepository.findById(id);

    if (!ordemServico) {
      throw new OrdemServicoNotFoundError("Ordem de servico nao encontrada");
    }

    return ordemServico;
  },

  async update(id: number, data: OrdemServicoInput) {
    ensureObjectPayload(data);

    const ordemAtual = await this.findById(id);
    const finalState = await buildFinalState(data, ordemAtual);

    return ordemServicoRepository.update(id, toUpdateRepositoryData(finalState));
  },

  async delete(id: number) {
    await this.findById(id);

    return ordemServicoRepository.delete(id);
  },

  async updateStatusAndSetor(id: number, data: OrdemServicoStatusPatchInput) {
    ensureObjectPayload(data, "Dados do patch da ordem de servico invalidos");

    const payloadKeys = Object.keys(data);

    if (payloadKeys.length === 0) {
      throw new OrdemServicoValidationError(
        "Informe status e/ou setorAtual para atualizar a ordem de servico",
      );
    }

    if (payloadKeys.some((key) => !patchAllowedKeys.has(key))) {
      throw new OrdemServicoValidationError(
        "O patch da ordem de servico permite apenas status e setorAtual",
      );
    }

    if (!hasOwnKey(data, "status") && !hasOwnKey(data, "setorAtual")) {
      throw new OrdemServicoValidationError(
        "Informe status e/ou setorAtual para atualizar a ordem de servico",
      );
    }

    const ordemAtual = await this.findById(id);
    const finalState = await buildFinalState(data, ordemAtual);
    const patchData = {
      status: finalState.status,
      setorAtual: finalState.setorAtual,
      dataEntregaReal: finalState.dataEntregaReal,
    } as Parameters<typeof ordemServicoRepository.update>[1];

    return ordemServicoRepository.update(id, patchData);
  },
};
