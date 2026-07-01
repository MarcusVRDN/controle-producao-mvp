import { prisma } from "../config/prisma.js";

type CreateOrdemServicoData = {
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

type UpdateOrdemServicoData = {
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
    create(data: CreateOrdemServicoData) {
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

    update(id: number, data: UpdateOrdemServicoData) {
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