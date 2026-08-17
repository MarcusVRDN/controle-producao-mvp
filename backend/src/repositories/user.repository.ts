import { prisma } from "../config/prisma.js";

export type UserPersistedData = {
  nome: string;
  email: string;
  senha: string;
};

export const userRepository = {
  create(data: UserPersistedData) {
    return prisma.user.create({ data });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};