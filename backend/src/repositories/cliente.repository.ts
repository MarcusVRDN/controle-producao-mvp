import { prisma } from "../config/prisma.js";

export type ClientePersistedData = {
  nome: string;
  cnpj: string;
  contato: string | null;
  telefone: string | null;
  ativo: boolean;
};

export const clienteRepository = {
  create(data: ClientePersistedData) {
    return prisma.cliente.create({ data });
  },

  findAll() {
    return prisma.cliente.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: number) {
    return prisma.cliente.findUnique({
      where: { id },
    });
  },

  update(id: number, data: ClientePersistedData) {
    return prisma.cliente.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.cliente.delete({
      where: { id },
    });
  },
};
