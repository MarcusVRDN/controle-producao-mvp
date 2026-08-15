const tratamentoTermicoOptions = [
  "Nenhum",
  "Tempera",
  "Cementacao",
  "Nitretacao",
  "Tempera por Inducao",
  "Tempera a Vacuo",
] as const;

const tratamentoSuperficialOptions = [
  "Nenhum",
  "Niquel Quimico",
  "Oxidacao Negra",
  "Anodizacao Natural",
  "Anodizacao Dura",
  "Zincagem",
  "Fosfatizacao",
  "Jateamento",
  "Pintura",
  "Plasma",
  "Cromo",
  "Silicone",
] as const;

const terceirizacaoOptions = [
  "Nenhuma",
  "Solda",
  "Corte a Fio",
  "Corte a Laser",
  "Calandra",
  "Balanceamento",
  "Furacao Profunda",
] as const;

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

function normalizePecaOptionValue(
  value: string | null | undefined,
  aliases: Map<string, string>,
) {
  if (!value) {
    return "";
  }

  return aliases.get(normalizeOptionKey(value)) ?? value;
}

export function normalizeTratamentoTermicoValue(value: string | null | undefined) {
  return normalizePecaOptionValue(value, tratamentoTermicoAliases);
}

export function normalizeTratamentoSuperficialValue(
  value: string | null | undefined,
) {
  return normalizePecaOptionValue(value, tratamentoSuperficialAliases);
}

export function normalizeTerceirizacaoValue(value: string | null | undefined) {
  return normalizePecaOptionValue(value, terceirizacaoAliases);
}

export {
  tratamentoTermicoOptions,
  tratamentoSuperficialOptions,
  terceirizacaoOptions,
};
