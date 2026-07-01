import { Request, Response } from "express";
import { ordemServicoService } from "../services/ordemServicoService.js";

export async function create(req: Request, res: Response) {
    try {
        const ordemServico = await ordemServicoService.create(req.body);

        return res.status(201).json(ordemServico);
    } catch (error) {
        console.error(error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Erro ao criar ordem de serviço",
    });
    }
};

export async function findAll(req: Request, res: Response) {
    try {
        const ordensServico = await ordemServicoService.findAll();

        return res.status(200).json(ordensServico)
    } catch (error){
        console.error(error);

        return res.status(500).json({ error: "Erro ao buscar ordens de serviço" });
    }
};

export async function findById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const ordemServico = await ordemServicoService.findById(id);

        return res.status(200).json(ordemServico)
    } catch (error) {
        console.error(error);
        return res.status(404).json({
            error: error instanceof Error ? error.message : "Erro ao buscar ordem de serviço",
        });
    }
};

export async function update (req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        
        const ordemServico = await ordemServicoService.update(id, req.body);

        return res.status(200).json(ordemServico)
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error instanceof Error ? error.message : "Erro ao atualizar ordem de serviço",
        });
    }
};

export async function remove (req: Request, res: Response) {
      try {
        const id = Number(req.params.id);
    
        await ordemServicoService.delete(id);
    
        return res.status(204).send();
      } catch (error) {
        console.error(error);
        return res.status(400).json({
          error: error instanceof Error ? error.message : "Erro ao remover ordem de serviço",
        });
      }
    }