import { Request, Response } from "express";
import {
  authService,
  AuthValidationError,
  AuthError,
} from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof AuthValidationError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AuthValidationError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error instanceof AuthError) {
      return res.status(401).json({
        error: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}