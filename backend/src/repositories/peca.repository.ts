import { prisma } from "../config/prisma.js";

type CreatePecaData = {
codigo: string;
clienteId: number;
descricao: string;
material: string;
tratamentoSuperficial?: string;
tratamentoTermico?: string;
terceirizacao?: string;
observacao?: string;
}

type UpdatePecaData = {
codigo?: string;
clienteId?: number;
descricao?: string;
material?: string;
tratamentoSuperficial?: string;
tratamentoTermico?: string;
terceirizacao?: string;
observacao?: string;
ativo?: boolean;
}

export const pecaRepository = {
    create(data:CreatePecaData) {
        return prisma.peca.create({data});
    },

    findAll() {
       return prisma.peca.findMany ({
        orderBy: {
            createdAt: "desc"
        },
       });
    },

    findById(id: number) {
        return prisma.peca.findUnique({
            where: {id}
        })
    },

    update(id: number, data: UpdatePecaData) {
        return prisma.peca.update({
            where:{id},
            data
        })
    },

    delete(id: number) {
        return prisma.peca.delete({
            where: {id}
        })
    }

}