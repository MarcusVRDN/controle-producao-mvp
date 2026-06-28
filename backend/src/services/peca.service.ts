import { pecaRepository } from "../repositories/peca.repository.js";
import { clienteRepository } from "../repositories/cliente.repository.js";

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
}

export const pecaService = {
    async create(data: CreatePecaData) {
        const cliente = await clienteRepository.findById(data.clienteId);

        if (!cliente) {
            throw new Error("Cliente não encontrado");
        }

        if (!data.codigo?.trim()) {
            throw new Error("Código é obrigatório")
        }

        return pecaRepository.create(data);
    },

    async findAll() {
        return pecaRepository.findAll();
    },

    async findById(id: number) {
        const peca = await pecaRepository.findById(id);

        if (!peca) {
            throw new Error("Peça não encontrada")
        }
        
        return peca;
    },

    async update(id: number, data: UpdatePecaData) {
        await this.findById(id)

        return pecaRepository.update(id, data);
    },

    async delete(id: number) {
        await this.findById(id)
        
        return pecaRepository.delete(id);
    }

}