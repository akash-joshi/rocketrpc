import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const api = {
  prisma,
  hello: () => "Hello World",
};

export type API = typeof api;
