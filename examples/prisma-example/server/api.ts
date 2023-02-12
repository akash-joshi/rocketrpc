import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const api = {
  prisma,
  hello: () => "Hello World",
  sum: (num1: number, num2: number) => num1 + num2,
};

export type API = typeof api;
