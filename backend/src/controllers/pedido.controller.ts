import { Request, Response } from "express";
import { pedidoService } from "../services/pedido.service.js";

export async function create(req: Request, res: Response) {
  try {
    const pedido = await pedidoService.create(req.body);

    return res.status(201).json(pedido);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error instanceof Error ? error.message : "Erro ao criar pedido",
    });
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await pedidoService.findAll();

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao buscar pedidos",
    });
  }
}

export async function findById (req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const pedido = await pedidoService.findById(id)

        return res.status(200).json(pedido);
    } catch (error) {
        console.error(error);
        return res.status(404).json({
            error: error instanceof Error ? error.message : "Erro ao buscar pedido",
        });
    }
}

export async function update (req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        const pedido = await pedidoService.update(id, req.body)

        return res.status(200).json(pedido)
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

        await pedidoService.delete(id)

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error instanceof Error ? error.message : "Erro ao remover peça",
        });
    }
}