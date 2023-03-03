import { Server } from "../../../src/index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const api = {
  prisma,
  hello: () => "Hello World",
  sum: (num1: number, num2: number) => num1 + num2,
  ping: (arg: string) => {
    return `Pong - ${arg}`;
  },
};

export type API = typeof api;

Server(8080, api, {
  serverOptions: {
    cors: {
      origin: "*",
    },
  },
});
