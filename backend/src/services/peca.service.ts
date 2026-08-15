import { clienteRepository } from "../repositories/cliente.repository.js";
import {
  pecaRepository,
  type PecaPersistedData,
} from "../repositories/peca.repository.js";

type PecaInput = {
  codigo?: unknown;
  clienteId?: unknown;
  descricao?: unknown;
  material?: unknown;
  tratamentoSuperficial?: unknown;
  tratamentoTermico?: unknown;
  terceirizacao?: unknown;
  observacao?: unknown;
};

type PecaRecord = NonNullable<Awaited<ReturnType<typeof pecaRepository.findById>>>;

export class PecaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PecaValidationError";
  }
}

export class PecaNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PecaNotFoundError";
  }
}

function hasOwnKey(value: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function ensureObjectPayload(
  value: unknown,
  message = "Dados da peca invalidos",
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new PecaValidationError(message);
  }
}

function normalizeRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new PecaValidationError(`${fieldName} e obrigatorio`);
  }

  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    throw new PecaValidationError(`${fieldName} e obrigatorio`);
  }

  return normalizedValue;
}

function normalizeOptionalString(value: unknown, fieldName: string) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new PecaValidationError(`${fieldName} invalido`);
  }

  const normalizedValue = value.trim();
  return normalizedValue === "" ? null : normalizedValue;
}

function requirePositiveInteger(value: unknown, fieldName: string) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new PecaValidationError(
      `${fieldName} deve ser um inteiro maior que zero`,
    );
  }

  return value;
}

function normalizeOptionKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function registerOptionAliases(
  map: Map<string, string>,
  canonicalValue: string,
  aliases: string[],
) {
  map.set(normalizeOptionKey(canonicalValue), canonicalValue);

  for (const alias of aliases) {
    map.set(normalizeOptionKey(alias), canonicalValue);
  }
}

const tratamentoTermicoAliases = new Map<string, string>();
registerOptionAliases(tratamentoTermicoAliases, "Nenhum", ["nenhum"]);
registerOptionAliases(tratamentoTermicoAliases, "Tempera", [
  "Têmpera",
  "tempera",
]);
registerOptionAliases(tratamentoTermicoAliases, "Cementacao", [
  "Cementação",
  "cementacao",
]);
registerOptionAliases(tratamentoTermicoAliases, "Nitretacao", [
  "Nitretação",
  "nitretacao",
]);
registerOptionAliases(tratamentoTermicoAliases, "Tempera por Inducao", [
  "Têmpera por Indução",
  "temperaInducao",
]);
registerOptionAliases(tratamentoTermicoAliases, "Tempera a Vacuo", [
  "Têmpera à Vácuo",
  "temperaVacuo",
]);

const tratamentoSuperficialAliases = new Map<string, string>();
registerOptionAliases(tratamentoSuperficialAliases, "Nenhum", ["nenhum"]);
registerOptionAliases(tratamentoSuperficialAliases, "Niquel Quimico", [
  "Níquel Químico",
  "niquel",
]);
registerOptionAliases(tratamentoSuperficialAliases, "Oxidacao Negra", [
  "Oxidação Negra",
  "oxidacao",
]);
registerOptionAliases(
  tratamentoSuperficialAliases,
  "Anodizacao Natural",
  ["Anodização Natural", "anodizacaoNatural"],
);
registerOptionAliases(tratamentoSuperficialAliases, "Anodizacao Dura", [
  "Anodização Dura",
  "anodizacaoDura",
]);
registerOptionAliases(tratamentoSuperficialAliases, "Zincagem", ["zincagem"]);
registerOptionAliases(tratamentoSuperficialAliases, "Fosfatizacao", [
  "Fosfatização",
  "fosfatizacao",
]);
registerOptionAliases(tratamentoSuperficialAliases, "Jateamento", [
  "jateamento",
]);
registerOptionAliases(tratamentoSuperficialAliases, "Pintura", ["pintura"]);
registerOptionAliases(tratamentoSuperficialAliases, "Plasma", ["plasma"]);
registerOptionAliases(tratamentoSuperficialAliases, "Cromo", ["cromo"]);
registerOptionAliases(tratamentoSuperficialAliases, "Silicone", ["silicone"]);

const terceirizacaoAliases = new Map<string, string>();
registerOptionAliases(terceirizacaoAliases, "Nenhuma", ["nenhuma"]);
registerOptionAliases(terceirizacaoAliases, "Solda", ["solda"]);
registerOptionAliases(terceirizacaoAliases, "Corte a Fio", [
  "corteFio",
  "corte fio",
]);
registerOptionAliases(terceirizacaoAliases, "Corte a Laser", [
  "corteLaser",
  "corte laser",
]);
registerOptionAliases(terceirizacaoAliases, "Calandra", ["calandra"]);
registerOptionAliases(terceirizacaoAliases, "Balanceamento", [
  "balanceamento",
]);
registerOptionAliases(terceirizacaoAliases, "Furacao Profunda", [
  "Furação Profunda",
  "furacaoProfunda",
]);

function normalizeSelectableOptionalString(
  value: unknown,
  fieldName: string,
  aliases: Map<string, string>,
) {
  const normalizedValue = normalizeOptionalString(value, fieldName);

  if (normalizedValue === null) {
    return null;
  }

  return aliases.get(normalizeOptionKey(normalizedValue)) ?? normalizedValue;
}

async function ensureClienteExists(clienteId: number) {
  const cliente = await clienteRepository.findById(clienteId);

  if (!cliente) {
    throw new PecaNotFoundError("Cliente nao encontrado");
  }
}

async function buildFinalState(
  payload: Record<string, unknown>,
  current?: PecaRecord,
): Promise<PecaPersistedData> {
  const codigoSource = hasOwnKey(payload, "codigo") ? payload.codigo : current?.codigo;

  if (codigoSource === undefined) {
    throw new PecaValidationError("Codigo e obrigatorio");
  }

  const clienteIdSource = hasOwnKey(payload, "clienteId")
    ? payload.clienteId
    : current?.clienteId;

  if (clienteIdSource === undefined) {
    throw new PecaValidationError("clienteId e obrigatorio");
  }

  const descricaoSource = hasOwnKey(payload, "descricao")
    ? payload.descricao
    : current?.descricao;

  if (descricaoSource === undefined) {
    throw new PecaValidationError("Descricao e obrigatoria");
  }

  const materialSource = hasOwnKey(payload, "material")
    ? payload.material
    : current?.material;

  if (materialSource === undefined) {
    throw new PecaValidationError("Material e obrigatorio");
  }

  const clienteId = requirePositiveInteger(clienteIdSource, "clienteId");
  await ensureClienteExists(clienteId);

  return {
    codigo: normalizeRequiredString(codigoSource, "Codigo"),
    clienteId,
    descricao: normalizeRequiredString(descricaoSource, "Descricao"),
    material: normalizeRequiredString(materialSource, "Material"),
    tratamentoSuperficial: hasOwnKey(payload, "tratamentoSuperficial")
      ? normalizeSelectableOptionalString(
          payload.tratamentoSuperficial,
          "Tratamento superficial",
          tratamentoSuperficialAliases,
        )
      : (current?.tratamentoSuperficial ?? null),
    tratamentoTermico: hasOwnKey(payload, "tratamentoTermico")
      ? normalizeSelectableOptionalString(
          payload.tratamentoTermico,
          "Tratamento termico",
          tratamentoTermicoAliases,
        )
      : (current?.tratamentoTermico ?? null),
    terceirizacao: hasOwnKey(payload, "terceirizacao")
      ? normalizeSelectableOptionalString(
          payload.terceirizacao,
          "Terceirizacao",
          terceirizacaoAliases,
        )
      : (current?.terceirizacao ?? null),
    observacao: hasOwnKey(payload, "observacao")
      ? normalizeOptionalString(payload.observacao, "Observacao")
      : (current?.observacao ?? null),
  };
}

export const pecaService = {
  async create(data: PecaInput) {
    ensureObjectPayload(data);

    const finalState = await buildFinalState(data);
    return pecaRepository.create(finalState);
  },

  async findAll() {
    return pecaRepository.findAll();
  },

  async findById(id: number) {
    const peca = await pecaRepository.findById(id);

    if (!peca) {
      throw new PecaNotFoundError("Peca nao encontrada");
    }

    return peca;
  },

  async update(id: number, data: PecaInput) {
    ensureObjectPayload(data);

    const pecaAtual = await this.findById(id);
    const finalState = await buildFinalState(data, pecaAtual);

    return pecaRepository.update(id, finalState);
  },

  async delete(id: number) {
    await this.findById(id);
    return pecaRepository.delete(id);
  },
};
