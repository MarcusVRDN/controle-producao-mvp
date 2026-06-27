import { clienteRepository } from "../repositories/cliente.repository.js";
import { pedidoRepository } from "../repositories/pedido.repository.js";

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

export const pedidoService = {
    async create(data: CreatePedidoData) {
        const cliente = await clienteRepository.findById (data.clienteId);

        if (!cliente) {
            throw new Error ("Cliente não encontrado");
        };

        if (!data.codigo) {
            throw new Error ("Código é obrigatório");
        };
        return pedidoRepository.create(data);
    },

    async findAll() {
        return pedidoRepository.findAll();
    },

    async findById (id: number){
        const pedido = await pedidoRepository.findById(id);

        if(!pedido) {
            throw new Error ("Pedido não encontrado")
        };
        return pedido;
    },

    async update (id: number, data:UpdatePedidoData) {
        await this.findById(id);

        return pedidoRepository.update (id, data);
    },

    async delete (id:number) {
        await this.findById(id);

        return pedidoRepository.delete(id);
    }
}
