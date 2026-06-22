import { prisma } from "../config/prisma.js";

type CreateClienteData = {
  nome: string;
  cnpj: string;
  contato?: string;
  telefone?: string;
};

type UpdateClienteData = {
  nome?: string;
  cnpj?: string;
  contato?: string;
  telefone?: string;
  ativo?: boolean;
};


export const clienteRepository = {
    create(data: CreateClienteData) {
      return prisma.cliente.create({data})
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
        where: {id}
      });
    },
    update(id: number, data: UpdateClienteData) {
      return prisma.cliente.update({
        where: {id},
        data
      })
    },
    delete(id: number){
      return prisma.cliente.delete({
        where: {id}
      });
    }
}