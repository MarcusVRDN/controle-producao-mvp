export const statusOrdemServicoOptions = [
  { value: "NAO_INICIADA", label: "Não iniciada" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
  { value: "CANCELADA", label: "Cancelada" },
] as const;

export const setorAtualOptions = [
  { value: "TORNO_MECANICO", label: "Torno mecânico" },
  { value: "TORNO_CNC", label: "Torno CNC" },
  { value: "CENTRO_USINAGEM", label: "Centro de usinagem" },
  { value: "FRESA_CONVENCIONAL", label: "Fresa convencional" },
  { value: "MANDRILHADORA", label: "Mandrilhadora" },
  { value: "RETIFICA", label: "Retífica" },
  { value: "ROSQUEADEIRA", label: "Rosqueadeira" },
  { value: "AJUSTAGEM", label: "Ajustagem" },
  { value: "SERVICO_EXTERNO", label: "Serviço externo" },
  { value: "QUALIDADE", label: "Qualidade" },
  { value: "LIBERADO", label: "Liberado" },
] as const;

export type StatusOrdemServico =
  (typeof statusOrdemServicoOptions)[number]["value"];
export type SetorOrdemServico = (typeof setorAtualOptions)[number]["value"];

export const setorProdutivoOptions = setorAtualOptions.filter(
  (setor) => setor.value !== "LIBERADO",
);

const statusLabels = Object.fromEntries(
  statusOrdemServicoOptions.map((status) => [status.value, status.label]),
) as Record<StatusOrdemServico, string>;

const setorLabels = Object.fromEntries(
  setorAtualOptions.map((setor) => [setor.value, setor.label]),
) as Record<SetorOrdemServico, string>;

export function getStatusLabel(status: string) {
  return statusLabels[status as StatusOrdemServico] ?? status;
}

export function getSetorAtualLabel(setorAtual: string | null | undefined) {
  if (!setorAtual) {
    return "Sem setor atual";
  }

  return setorLabels[setorAtual as SetorOrdemServico] ?? setorAtual;
}

export function isSetorProdutivo(
  setorAtual: string | null | undefined,
): setorAtual is Exclude<SetorOrdemServico, "LIBERADO"> {
  return (
    typeof setorAtual === "string" &&
    setorAtual.length > 0 &&
    setorAtual !== "LIBERADO" &&
    setorProdutivoOptions.some((setor) => setor.value === setorAtual)
  );
}
