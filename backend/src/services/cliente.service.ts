import { clienteRepository } from "../repositories/cliente.repository.js";

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

export const clienteService = {
  async create(data: CreateClienteData) {
    if (!data.nome || !data.cnpj) {
      throw new Error("Nome e CNPJ são obrigatórios")
    }
    return clienteRepository.create(data);
  },

  async findAll() {
    return clienteRepository.findAll();
  },

  async findById(id: number) {
    const cliente = await clienteRepository.findById(id);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    return cliente;
  },

  async update(id: number, data: UpdateClienteData) {
    await this.findById(id);

    return clienteRepository.update(id, data);
  },

  async delete (id: number) {
    await this.findById(id);
    return clienteRepository.delete(id);
  }
}