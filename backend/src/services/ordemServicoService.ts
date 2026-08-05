import { ordemServicoRepository } from "../repositories/ordemServico.repository.js";
import { pedidoRepository } from "../repositories/pedido.repository.js";
import { pecaRepository } from "../repositories/peca.repository.js";
import { StatusOrdemServico, SetorOrdemServico } from "@prisma/client";

type CreateOrdemServicoData = {
  numero: number;
  pedidoId: number;
  pecaId: number;
  quantidade: number;
  horasUnitarias: number;
  horasTotais: number;
  setores: string;
  dataEntregaSolicitada: Date;
  dataEntregaReal?: Date;
  observacao?: string;
  status?: StatusOrdemServico;
  setorAtual?: SetorOrdemServico;
  possuiRnc?: boolean;
  possuiDevolucao?: boolean;
  dataRnc?: Date;
  dataDevolucao?: Date;
};

type UpdateOrdemServicoData = {
  numero?: number;
  pedidoId?: number;
  pecaId?: number;
  quantidade?: number;
  horasUnitarias?: number;
  horasTotais?: number;
  setores?: string;
  dataEntregaSolicitada?: Date;
  dataEntregaReal?: Date;
  observacao?: string;
  status?: StatusOrdemServico;
  setorAtual?: SetorOrdemServico | null;
  possuiRnc?: boolean;
  possuiDevolucao?: boolean;
  dataRnc?: Date | null;
  dataDevolucao?: Date | null;
};

export const ordemServicoService = {
  async create(data: CreateOrdemServicoData) {
    if (!data.numero) {
      throw new Error("Número da ordem de serviço é obrigatório");
    }

    const pedido = await pedidoRepository.findById(data.pedidoId);

    if (!pedido) {
      throw new Error("Pedido não encontrado");
    }

    const peca = await pecaRepository.findById(data.pecaId);

    if (!peca) {
      throw new Error("Peça não encontrada");
    }

    return ordemServicoRepository.create(data);
  },
  async findAll() {
    return ordemServicoRepository.findAll();
  },

  async findById(id: number) {
    const ordemServico = await ordemServicoRepository.findById(id);

    if (!ordemServico) {
      throw new Error("Ordem de Serviço não encontrada");
    }
    return ordemServico;
  },

  async update(id: number, data: UpdateOrdemServicoData) {
    await this.findById(id);

    return ordemServicoRepository.update(id, data);
  },

  async delete(id: number) {
    await this.findById(id);

    return ordemServicoRepository.delete(id);
  },
};
