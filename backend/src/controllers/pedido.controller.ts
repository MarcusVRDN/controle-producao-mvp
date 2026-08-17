import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  pedidoService,
  PedidoNotFoundError,
  PedidoValidationError,
} from "../services/pedido.service.js";

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

function isUniqueCodigoError(error: unknown) {
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

function handlePedidoError(
  error: unknown,
  res: Response,
  unexpectedMessage: string,
) {
  if (error instanceof PedidoValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof PedidoNotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (isUniqueCodigoError(error)) {
    return res.status(409).json({
      error: "Código do pedido já cadastrado",
    });
  }

  if (isForeignKeyConstraintError(error)) {
    return res.status(409).json({
      error: "Pedido possui registros relacionados e não pode ser removido",
    });
  }

  console.error(error);
  return res.status(500).json({ error: unexpectedMessage });
}

export async function create(req: Request, res: Response) {
  try {
    const pedido = await pedidoService.create(req.body);

    return res.status(201).json(pedido);
  } catch (error) {
    return handlePedidoError(error, res, "Erro interno ao criar pedido");
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await pedidoService.findAll();

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao buscar pedidos",
    });
  }
}

export async function findById(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID do pedido inválido",
    });
  }

  try {
    const pedido = await pedidoService.findById(id);

    return res.status(200).json(pedido);
  } catch (error) {
    return handlePedidoError(error, res, "Erro interno ao buscar pedido");
  }
}

export async function update(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID do pedido inválido",
    });
  }

  try {
    const pedido = await pedidoService.update(id, req.body);

    return res.status(200).json(pedido);
  } catch (error) {
    return handlePedidoError(error, res, "Erro interno ao atualizar pedido");
  }
}

export async function remove(req: Request, res: Response) {
  const id = parseRouteId(req.params.id);

  if (id === null) {
    return res.status(400).json({
      error: "ID do pedido inválido",
    });
  }

  try {
    await pedidoService.delete(id);

    return res.status(204).send();
  } catch (error) {
    return handlePedidoError(error, res, "Erro interno ao remover pedido");
  }
}
