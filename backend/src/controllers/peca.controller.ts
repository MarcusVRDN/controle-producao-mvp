import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  pecaService,
  PecaNotFoundError,
  PecaValidationError,
} from "../services/peca.service.js";

function parseRouteId(rawId: string | string[] | undefined) {
  if (typeof rawId !== "string") {
    return null;
  }

  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function isUniqueCodigoClienteError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function isForeignKeyConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  );
}

function handlePecaError(
  error: unknown,
  res: Response,
  unexpectedMessage: string,
) {
  if (error instanceof PecaValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof PecaNotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (isUniqueCodigoClienteError(error)) {
    return res.status(409).json({
      error: "Ja existe uma peca com esse codigo para o cliente informado",
    });
  }

  if (isForeignKeyConstraintError(error)) {
    return res.status(409).json({
      error: "Peca possui registros relacionados e nao pode ser removida",
    });
  }

  console.error(error);
  return res.status(500).json({ error: unexpectedMessage });
}

export async function create(req: Request, res: Response) {
  try {
    const peca = await pecaService.create(req.body);

    return res.status(201).json(peca);
  } catch (error) {
    return handlePecaError(error, res, "Erro interno ao criar peca");
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const pecas = await pecaService.findAll();

    return res.status(200).json(pecas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao buscar pecas",
    });
  }
}

export async function findById(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da peca invalido",
    });
  }

  try {
    const peca = await pecaService.findById(id);

    return res.status(200).json(peca);
  } catch (error) {
    return handlePecaError(error, res, "Erro interno ao buscar peca");
  }
}

export async function update(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da peca invalido",
    });
  }

  try {
    const peca = await pecaService.update(id, req.body);

    return res.status(200).json(peca);
  } catch (error) {
    return handlePecaError(error, res, "Erro interno ao atualizar peca");
  }
}

export async function remove(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID da peca invalido",
    });
  }

  try {
    await pecaService.delete(id);

    return res.status(204).send();
  } catch (error) {
    return handlePecaError(error, res, "Erro interno ao remover peca");
  }
}
