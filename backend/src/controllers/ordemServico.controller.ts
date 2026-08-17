import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  ordemServicoService,
  OrdemServicoNotFoundError,
  OrdemServicoValidationError,
} from "../services/ordemServicoService.js";

function parseRouteId(rawId: string | string[] | undefined): number | null {
  if (typeof rawId !== "string") {
    return null;
  }

  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function isUniqueNumeroError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function handleOrdemServicoError(
  error: unknown,
  res: Response,
  unexpectedMessage: string,
) {
  if (error instanceof OrdemServicoValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof OrdemServicoNotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (isUniqueNumeroError(error)) {
    return res.status(409).json({
      error: "Número da ordem de serviço já cadastrado",
    });
  }

  console.error(error);
  return res.status(500).json({ error: unexpectedMessage });
}

export async function create(req: Request, res: Response) {
  try {
    const ordemServico = await ordemServicoService.create(req.body);

    return res.status(201).json(ordemServico);
  } catch (error) {
    return handleOrdemServicoError(
      error,
      res,
      "Erro interno ao criar ordem de serviço",
    );
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const ordensServico = await ordemServicoService.findAll();

    return res.status(200).json(ordensServico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao buscar ordens de serviço",
    });
  }
}

export async function findById(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da ordem de serviço inválido",
    });
  }

  try {
    const ordemServico = await ordemServicoService.findById(id);

    return res.status(200).json(ordemServico);
  } catch (error) {
    return handleOrdemServicoError(
      error,
      res,
      "Erro interno ao buscar ordem de serviço",
    );
  }
}

export async function update(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da ordem de serviço inválido",
    });
  }

  try {
    const ordemServico = await ordemServicoService.update(id, req.body);

    return res.status(200).json(ordemServico);
  } catch (error) {
    return handleOrdemServicoError(
      error,
      res,
      "Erro interno ao atualizar ordem de serviço",
    );
  }
}

export async function remove(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da ordem de serviço inválido",
    });
  }

  try {
    await ordemServicoService.delete(id);

    return res.status(204).send();
  } catch (error) {
    return handleOrdemServicoError(
      error,
      res,
      "Erro interno ao remover ordem de serviço",
    );
  }
}

export async function patchStatusAndSetor(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da ordem de serviço inválido",
    });
  }

  try {
    const ordemAtualizada = await ordemServicoService.updateStatusAndSetor(
      id,
      req.body,
    );

    return res.status(200).json(ordemAtualizada);
  } catch (error) {
    return handleOrdemServicoError(
      error,
      res,
      "Erro interno ao atualizar status da ordem de serviço",
    );
  }
}
