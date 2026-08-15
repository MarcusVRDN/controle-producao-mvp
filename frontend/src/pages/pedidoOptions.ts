export const pedidoStatusOptions = [
  { value: "ABERTO", label: "Aberto" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDO", label: "Concluido" },
  { value: "CANCELADO", label: "Cancelado" },
] as const;

export type PedidoStatus = (typeof pedidoStatusOptions)[number]["value"];

const pedidoStatusLabels = Object.fromEntries(
  pedidoStatusOptions.map((status) => [status.value, status.label]),
) as Record<PedidoStatus, string>;

export function getPedidoStatusLabel(status: string) {
  return pedidoStatusLabels[status as PedidoStatus] ?? status;
}
