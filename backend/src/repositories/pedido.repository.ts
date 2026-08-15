import { StatusPedido } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export type PedidoPersistedData = {
  codigo: string;
  clienteId: number;
  observacao: string | null;
  status: StatusPedido;
};

export const pedidoRepository = {
  create(data: PedidoPersistedData) {
    return prisma.pedido.create({ data });
  },

  findAll() {
    return prisma.pedido.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
    });
  },

  update(id: number, data: PedidoPersistedData) {
    return prisma.pedido.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.pedido.delete({
      where: { id },
    });
  },
};
