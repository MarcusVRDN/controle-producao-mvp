import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  clienteService,
  ClienteNotFoundError,
  ClienteValidationError,
} from "../services/cliente.service.js";

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

function isUniqueCnpjError(error: unknown) {
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

function handleClienteError(
  error: unknown,
  res: Response,
  unexpectedMessage: string,
) {
  if (error instanceof ClienteValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof ClienteNotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (isUniqueCnpjError(error)) {
    return res.status(409).json({
      error: "CNPJ do cliente já cadastrado",
    });
  }

  if (isForeignKeyConstraintError(error)) {
    return res.status(409).json({
      error: "Cliente possui registros relacionados e não pode ser removido",
    });
  }

  console.error(error);
  return res.status(500).json({ error: unexpectedMessage });
}

export async function create(req: Request, res: Response) {
  try {
    const cliente = await clienteService.create(req.body);

    return res.status(201).json(cliente);
  } catch (error) {
    return handleClienteError(error, res, "Erro interno ao criar cliente");
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const clientes = await clienteService.findAll();

    return res.status(200).json(clientes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao buscar clientes",
    });
  }
}

export async function findById(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID do cliente inválido",
    });
  }

  try {
    const cliente = await clienteService.findById(id);

    return res.status(200).json(cliente);
  } catch (error) {
    return handleClienteError(error, res, "Erro interno ao buscar cliente");
  }
}

export async function update(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID do cliente inválido",
    });
  }

  try {
    const cliente = await clienteService.update(id, req.body);

    return res.status(200).json(cliente);
  } catch (error) {
    return handleClienteError(error, res, "Erro interno ao atualizar cliente");
  }
}

export async function remove(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID do cliente inválido",
    });
  }

  try {
    await clienteService.delete(id);

    return res.status(204).send();
  } catch (error) {
    return handleClienteError(error, res, "Erro interno ao remover cliente");
  }
}
