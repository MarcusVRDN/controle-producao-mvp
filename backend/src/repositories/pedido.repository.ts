import { prisma } from "../config/prisma.js";

type CreatePedidoData = {
    codigo: string
    clienteId: number
    observacao?: string
}

type UpdatePedidoData = {
    codigo?: string
    clienteId?: number
    observacao?: string
}

export const pedidoRepository = {
    create(data: CreatePedidoData) {
        return prisma.pedido.create({data})
    },

    findAll() {
        return prisma.pedido.findMany ({
            orderBy: {
                createdAt: "desc"
            }
        })
    },

    findById (id: number) {
        return prisma.pedido.findUnique ({
            where: {id}
        })
    },

    update (id:number, data: UpdatePedidoData) {
        return prisma.pedido.update ({
            where: {id},
            data
        })
    },

    delete(id:number) {
        return prisma.pedido.delete ({
            where: {id}
        })
    }

}