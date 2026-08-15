import {
  clienteRepository,
  type ClientePersistedData,
} from "../repositories/cliente.repository.js";

type ClienteInput = {
  nome?: unknown;
  cnpj?: unknown;
  contato?: unknown;
  telefone?: unknown;
  ativo?: unknown;
};

type ClienteRecord = NonNullable<
  Awaited<ReturnType<typeof clienteRepository.findById>>
>;

export class ClienteValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClienteValidationError";
  }
}

export class ClienteNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClienteNotFoundError";
  }
}

function hasOwnKey(value: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function ensureObjectPayload(
  value: unknown,
  message = "Dados do cliente invalidos",
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ClienteValidationError(message);
  }
}

function normalizeRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new ClienteValidationError(`${fieldName} e obrigatorio`);
  }

  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    throw new ClienteValidationError(`${fieldName} e obrigatorio`);
  }

  return normalizedValue;
}

function normalizeOptionalString(value: unknown, fieldName: string) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new ClienteValidationError(`${fieldName} invalido`);
  }

  const normalizedValue = value.trim();
  return normalizedValue === "" ? null : normalizedValue;
}

function parseBoolean(value: unknown, fieldName: string, fallbackValue: boolean) {
  if (value === undefined) {
    return fallbackValue;
  }

  if (typeof value !== "boolean") {
    throw new ClienteValidationError(`${fieldName} deve ser booleano`);
  }

  return value;
}

function buildFinalState(
  payload: Record<string, unknown>,
  current?: ClienteRecord,
): ClientePersistedData {
  const nomeSource = hasOwnKey(payload, "nome") ? payload.nome : current?.nome;

  if (nomeSource === undefined) {
    throw new ClienteValidationError("Nome e obrigatorio");
  }

  const cnpjSource = hasOwnKey(payload, "cnpj") ? payload.cnpj : current?.cnpj;

  if (cnpjSource === undefined) {
    throw new ClienteValidationError("CNPJ e obrigatorio");
  }

  return {
    nome: normalizeRequiredString(nomeSource, "Nome"),
    cnpj: normalizeRequiredString(cnpjSource, "CNPJ"),
    contato: hasOwnKey(payload, "contato")
      ? normalizeOptionalString(payload.contato, "Contato")
      : (current?.contato ?? null),
    telefone: hasOwnKey(payload, "telefone")
      ? normalizeOptionalString(payload.telefone, "Telefone")
      : (current?.telefone ?? null),
    ativo: parseBoolean(payload.ativo, "Ativo", current?.ativo ?? true),
  };
}

export const clienteService = {
  async create(data: ClienteInput) {
    ensureObjectPayload(data);

    const finalState = buildFinalState(data);
    return clienteRepository.create(finalState);
  },

  async findAll() {
    return clienteRepository.findAll();
  },

  async findById(id: number) {
    const cliente = await clienteRepository.findById(id);

    if (!cliente) {
      throw new ClienteNotFoundError("Cliente nao encontrado");
    }

    return cliente;
  },

  async update(id: number, data: ClienteInput) {
    ensureObjectPayload(data);

    const clienteAtual = await this.findById(id);
    const finalState = buildFinalState(data, clienteAtual);

    return clienteRepository.update(id, finalState);
  },

  async delete(id: number) {
    await this.findById(id);
    return clienteRepository.delete(id);
  },
};
