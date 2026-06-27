import { Request, Response } from "express";
import { pecaService } from "../services/peca.service.js";

export async function create (req: Request, res: Response) {
    try {
        const peca = await pecaService.create(req.body);

        return res.status(201).json(peca);
    } catch (error) {
        console.error(error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Erro ao criar peça",
    });
    }
}

export async function findAll(req: Request, res: Response) {
    try {
        const pecas = await pecaService.findAll();

        return res.status(200).json(pecas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar peça" });
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        const peca = await pecaService.findById(id)

        return res.status(200).json(peca);
    } catch (error) {
        console.error(error);
        return res.status(404).json({
            error: error instanceof Error ? error.message : "Erro ao buscar peça",
        });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        const peca = await pecaService.update(id, req.body)

        return res.status(200).json(peca);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error instanceof Error ? error.message : "Erro ao atualizar peça",
        });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        await pecaService.delete(id)

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error instanceof Error ? error.message : "Erro ao remover peça",
        });
    }
}