import { prisma } from "../config/prisma.js";
import { findById } from "../controllers/cliente.controller.js";

type createOrdemServicoData = {
    numero: number
    pedidoId: number
    pecaId: number
    quantidade: number
    horasUnitarias: number
    horasTotais: number
    setores: string
    dataEntregaSolicitada: string
    dataEntregaReal?: string
    observacao?: string
}

type updateOrdemServicoData = {
    numero?: number
    pedidoId?: number
    pecaId?: number
    quantidade?: number
    horasUnitarias?: number
    horasTotais?: number
    setores?: string
    dataEntregaSolicitada?: string
    dataEntregaReal?: string
    observacao?: string
}

export const ordemServicoRepository = {
    create(data: createOrdemServicoData) {
        return prisma.ordemServico.create({data});
    },

    findAll() {
        return prisma.ordemServico.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    },

    findById(id: number) {
        return prisma.ordemServico.findUnique({
            where: {id}
        });
    },

    update(id: number, data: updateOrdemServicoData) {
        return prisma.ordemServico.update({
            where: {id},
            data
        })
    },

    delete(id: number) {
        return prisma.ordemServico.delete({
            where: {id}
        });
    }
};