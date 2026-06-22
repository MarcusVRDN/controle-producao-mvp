import { Request, Response } from "express";
import { clienteService } from "../services/cliente.service.js";

export async function create(req : Request, res: Response){
    try {
        const cliente =  await clienteService.create(req.body);

        return res.status(201).json(cliente);
    } catch (error) {
        console.error(error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Erro ao criar cliente",
    });
    }
}

export async function findAll(req: Request, res: Response) {
    try{
    const clientes = await clienteService.findAll();

    return res.status(200).json(clientes);
    }catch (error){
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar clientes" });
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const cliente = await clienteService.findById(id);

        return res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        return res.status(404).json({
            error: error instanceof Error ? error.message : "Erro ao buscar cliente",
        });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const cliente = await clienteService.update(id, req.body);

        return res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error instanceof Error ? error.message : "Erro ao atualizar cliente",
        });
    }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await clienteService.delete(id);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Erro ao remover cliente",
    });
  }
}

