import { prisma } from "../config/prisma.js";
import { SetorOrdemServico, StatusOrdemServico } from "@prisma/client";

type CreateOrdemServicoData = {
  numero: number;
  pedidoId: number;
  pecaId: number;
  quantidade: number;
  horasUnitarias: number;
  horasTotais: number;
  setores: string;
  dataEntregaSolicitada: Date;
  dataEntregaReal?: Date;
  observacao?: string;
  status?: StatusOrdemServico;
  setorAtual?: SetorOrdemServico;
  possuiRnc?: boolean;
  possuiDevolucao?: boolean;
  dataRnc?: Date;
  dataDevolucao?: Date;
};

type UpdateOrdemServicoData = {
  numero?: number;
  pedidoId?: number;
  pecaId?: number;
  quantidade?: number;
  horasUnitarias?: number;
  horasTotais?: number;
  setores?: string;
  dataEntregaSolicitada?: Date;
  dataEntregaReal?: Date;
  observacao?: string;
  status?: StatusOrdemServico;
  setorAtual?: SetorOrdemServico | null;
  possuiRnc?: boolean;
  possuiDevolucao?: boolean;
  dataRnc?: Date | null;
  dataDevolucao?: Date | null;
};

export const ordemServicoRepository = {
  create(data: CreateOrdemServicoData) {
    return prisma.ordemServico.create({ data });
  },

  findAll() {
    return prisma.ordemServico.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: number) {
    return prisma.ordemServico.findUnique({
      where: { id },
    });
  },

  update(id: number, data: UpdateOrdemServicoData) {
    return prisma.ordemServico.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.ordemServico.delete({
      where: { id },
    });
  },
};
