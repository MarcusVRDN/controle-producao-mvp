import { prisma } from "../config/prisma.js";

export type PecaPersistedData = {
  codigo: string;
  clienteId: number;
  descricao: string;
  material: string;
  tratamentoSuperficial: string | null;
  tratamentoTermico: string | null;
  terceirizacao: string | null;
  observacao: string | null;
};

export const pecaRepository = {
  create(data: PecaPersistedData) {
    return prisma.peca.create({ data });
  },

  findAll() {
    return prisma.peca.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: number) {
    return prisma.peca.findUnique({
      where: { id },
    });
  },

  update(id: number, data: PecaPersistedData) {
    return prisma.peca.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.peca.delete({
      where: { id },
    });
  },
};
