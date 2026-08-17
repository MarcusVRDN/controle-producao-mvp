import { userRepository } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type RegisterInput = {
  nome?: unknown;
  email?: unknown;
  senha?: unknown;
};

type LoginInput = {
  email?: unknown;
  senha?: unknown;
};

export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthValidationError";
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function normalizeRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new AuthValidationError(`${fieldName} é obrigatório`);
  }
  const normalizedValue = value.trim();

  if (normalizedValue === "") {
    throw new AuthValidationError(`${fieldName} é obrigatório`);
  }
  return normalizedValue;
}

function normalizeEmail(value: unknown) {
  const email = normalizeRequiredString(value, "Email");

  return email.toLowerCase();
}

function validatePassword(value: unknown) {
  if (typeof value !== "string") {
    throw new AuthValidationError("Senha é obrigatória");
  }

  if (value.length < 5) {
    throw new AuthValidationError("A senha deve ter pelo menos 5 caracteres");
  }

  return value;
}

export const authService = {
  async register(data: RegisterInput) {
    const nome = normalizeRequiredString(data.nome, "Nome");
    const email = normalizeEmail(data.email);
    const senha = validatePassword(data.senha);

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AuthValidationError("Email já cadastrado");
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await userRepository.create({
      nome,
      email,
      senha: senhaHash,
    });
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
    };
  },
  async login(data: LoginInput) {
    const email = normalizeEmail(data.email);
    const senha = validatePassword(data.senha);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AuthError(`Email ou senha inválidos`);
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      throw new AuthError(`Email ou senha inválidos`);
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      token,
    };
  },
};
