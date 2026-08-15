import { StatusPedido } from "@prisma/client";
import { clienteRepository } from "../repositories/cliente.repository.js";
import {
  pedidoRepository,
  type PedidoPersistedData,
} from "../repositories/pedido.repository.js";

type PedidoInput = {
  codigo?: unknown;
  clienteId?: unknown;
  observacao?: unknown;
  status?: unknown;
};

type PedidoRecord = NonNullable<
  Awaited<ReturnType<typeof pedidoRepository.findById>>
>;

const statusValues = new Set<StatusPedido>(Object.values(StatusPedido));

export class PedidoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PedidoValidationError";
  }
}

export class PedidoNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PedidoNotFoundError";
  }
}

function hasOwnKey(value: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function ensureObjectPayload(
  value: unknown,
  message = "Dados do pedido invalidos",
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new PedidoValidationError(message);
  }
}

function normalizeRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new PedidoValidationError(`${fieldName} e obrigatorio`);
  }

  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    throw new PedidoValidationError(`${fieldName} e obrigatorio`);
  }

  return normalizedValue;
}

function normalizeOptionalString(value: unknown, fieldName: string) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new PedidoValidationError(`${fieldName} invalida`);
  }

  const normalizedValue = value.trim();
  return normalizedValue === "" ? null : normalizedValue;
}

function requirePositiveInteger(value: unknown, fieldName: string) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new PedidoValidationError(
      `${fieldName} deve ser um inteiro maior que zero`,
    );
  }

  return value;
}

function parseStatus(value: unknown) {
  if (typeof value !== "string" || !statusValues.has(value as StatusPedido)) {
    throw new PedidoValidationError("Status do pedido invalido");
  }

  return value as StatusPedido;
}

async function ensureClienteExists(clienteId: number) {
  const cliente = await clienteRepository.findById(clienteId);

  if (!cliente) {
    throw new PedidoNotFoundError("Cliente nao encontrado");
  }
}

async function buildFinalState(
  payload: Record<string, unknown>,
  current?: PedidoRecord,
): Promise<PedidoPersistedData> {
  const codigoSource = hasOwnKey(payload, "codigo") ? payload.codigo : current?.codigo;

  if (codigoSource === undefined) {
    throw new PedidoValidationError("Codigo e obrigatorio");
  }

  const clienteIdSource = hasOwnKey(payload, "clienteId")
    ? payload.clienteId
    : current?.clienteId;

  if (clienteIdSource === undefined) {
    throw new PedidoValidationError("clienteId e obrigatorio");
  }

  const clienteId = requirePositiveInteger(clienteIdSource, "clienteId");
  await ensureClienteExists(clienteId);

  const status = hasOwnKey(payload, "status")
    ? parseStatus(payload.status)
    : (current?.status ?? StatusPedido.ABERTO);

  return {
    codigo: normalizeRequiredString(codigoSource, "Codigo"),
    clienteId,
    observacao: hasOwnKey(payload, "observacao")
      ? normalizeOptionalString(payload.observacao, "Observacao")
      : (current?.observacao ?? null),
    status,
  };
}

export const pedidoService = {
  async create(data: PedidoInput) {
    ensureObjectPayload(data);

    const finalState = await buildFinalState(data);
    return pedidoRepository.create(finalState);
  },

  async findAll() {
    return pedidoRepository.findAll();
  },

  async findById(id: number) {
    const pedido = await pedidoRepository.findById(id);

    if (!pedido) {
      throw new PedidoNotFoundError("Pedido nao encontrado");
    }

    return pedido;
  },

  async update(id: number, data: PedidoInput) {
    ensureObjectPayload(data);

    const pedidoAtual = await this.findById(id);
    const finalState = await buildFinalState(data, pedidoAtual);

    return pedidoRepository.update(id, finalState);
  },

  async delete(id: number) {
    await this.findById(id);
    return pedidoRepository.delete(id);
  },
};
